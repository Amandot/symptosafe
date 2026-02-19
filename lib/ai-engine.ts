import OpenAI from 'openai';
import type { AIAnalysisResult, Message } from '@/types';

function languageLabel(language?: string) {
  switch (language) {
    case 'hi':
      return 'Hindi';
    case 'mr':
      return 'Marathi';
    case 'en':
    default:
      return 'English';
  }
}

function buildSystemPrompt(language?: string) {
  const lang = languageLabel(language);
  return `You are SymptoSafe, a safety-first AI medical symptom analysis assistant with multimodal capabilities.
Your job is to analyze user-described symptoms (text and/or images) and return a structured JSON response.

CRITICAL RULES:
1. Always generate DIFFERENT analysis depending on user symptoms.
2. Never return generic placeholder text.
3. Do not say "AI unavailable" or "local approximation".
4. Use realistic clinical reasoning with SPECIFIC medical condition names.
5. Provide probability estimates that add up to 100%.
6. Confidence scores must vary based on clarity of symptoms.
7. If symptoms are vague → lower diagnostic confidence.
8. If symptoms are detailed → higher confidence.
9. If emergency patterns are detected → mark risk as CRITICAL.
10. When analyzing images, correlate visual evidence (inflammation, discoloration, texture, swelling) with text description.
11. NEVER provide definitive diagnoses - always express uncertainty.
12. ALWAYS recommend consulting a healthcare professional in recommendations.
13. IMPORTANT: All human-readable strings in the JSON (condition names, reasoning, followUpQuestions, recommendation) MUST be written in ${lang}.

Return ONLY valid JSON in this exact format:
{
  "diagnosticConfidence": number (0-100),
  "informationCompleteness": number (0-100),
  "riskLevel": "critical" | "high" | "medium" | "low",
  "recommendation": ["string", "string"],
  "possibleConditions": [
    {
      "name": "Specific Medical Condition Name",
      "probability": number (must total 100 across all conditions)
    }
  ],
  "reasoning": ["bullet point reasoning"],
  "followUpQuestions": ["question 1", "question 2"]
}

Guidelines:
- Use SPECIFIC medical condition names (e.g., "Acute Pharyngitis", "Migraine", "Gastroenteritis", "Contact Dermatitis")
- Each analysis must be UNIQUE based on the actual symptoms described
- Probabilities across all conditions MUST sum to 100
- Include 2-5 possible conditions ranked by probability
- Provide 2-4 follow-up questions to gather more information
- Include 2-3 safety-focused recommendations
- Be medically cautious and safety-first
- If unsure, lower confidence rather than hallucinating

Examples of GOOD condition names:
- "Viral Upper Respiratory Infection"
- "Tension Headache"  
- "Acute Gastritis"
- "Allergic Rhinitis"
- "Musculoskeletal Strain"

Examples of BAD (too generic) condition names:
- "General symptom pattern"
- "Common illness"
- "Needs evaluation"

Do not include markdown. Return JSON only.`;
}

export async function analyzeSymptoms(
  messages: Message[],
  apiKey: string,
  imageBase64?: string,
  language?: string
): Promise<AIAnalysisResult> {
  try {
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build conversation history with multimodal support
    const conversationHistory = messages.map((msg) => {
      if (msg.imageUrl && msg.role === 'user') {
        return {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: msg.content },
            {
              type: 'image_url' as const,
              image_url: { url: msg.imageUrl },
            },
          ],
        };
      }
      return {
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      };
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt(language) },
        ...conversationHistory,
      ],
      temperature: 0.8, // Increased for more varied responses
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result: any = JSON.parse(content);

    // Validate and ensure all required fields
    if (!result.possibleConditions || !Array.isArray(result.possibleConditions)) {
      throw new Error('Invalid AI response format');
    }

    // Support both old and new field names for backward compatibility
    const confidenceScore = result.diagnosticConfidence ?? result.confidenceScore ?? 0;
    const recommendation = result.recommendation || [];

    return {
      possibleConditions: result.possibleConditions || [],
      reasoning: result.reasoning || [],
      confidenceScore: Math.min(100, Math.max(0, confidenceScore)),
      informationCompleteness: Math.min(100, Math.max(0, result.informationCompleteness || 0)),
      followUpQuestions: result.followUpQuestions || [],
      riskLevel: result.riskLevel || 'medium',
      recommendation,
    };
  } catch (error) {
    console.error('AI Analysis Error, falling back to local heuristic:', error);

    // Fallback: basic, non-AI heuristic so the UI continues to work
    const latest = messages[messages.length - 1];
    const text = latest?.content?.toLowerCase?.() ?? '';

    let riskLevel: AIAnalysisResult['riskLevel'] = 'medium';

    let conditionName = 'General symptom pattern';
    if (text.includes('chest pain') || text.includes('tightness in chest')) {
      conditionName = 'Possible cardiac or respiratory-related chest discomfort';
      riskLevel = 'high';
    } else if (text.includes('shortness of breath') || text.includes('trouble breathing')) {
      conditionName = 'Breathing difficulty that may involve the lungs or heart';
      riskLevel = 'high';
    } else if (text.includes('fever') || text.includes('temperature')) {
      conditionName = 'Infection-related illness (such as viral or bacterial infection)';
      riskLevel = 'medium';
    } else if (text.includes('headache') || text.includes('migraine')) {
      conditionName = 'Headache or migraine-type condition';
      riskLevel = 'medium';
    } else if (text.includes('stomach') || text.includes('abdominal') || text.includes('vomit')) {
      conditionName = 'Stomach or digestive system problem';
      riskLevel = 'medium';
    }

    const fallback: AIAnalysisResult = {
      possibleConditions: [
        {
          name: conditionName,
          probability: 70,
        },
        {
          name: 'Other causes not fully specified by current information',
          probability: 30,
        },
      ],
      reasoning: [
        'The description of your symptoms matches common patterns seen in similar conditions.',
        'This is an approximate assessment based on the words you used to describe your problem.',
      ],
      confidenceScore: 40,
      informationCompleteness: 40,
      // Remove generic follow‑up questions – UI will now focus on the condition info above
      followUpQuestions: [],
      riskLevel,
      recommendation: [
        'Use this information only as a general guide, not as a diagnosis.',
        'Consult with a healthcare professional for proper evaluation, especially if symptoms worsen or feel severe.',
      ],
    };

    return fallback;
  }
}
