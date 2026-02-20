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
10. When analyzing images, analyze visual characteristics (color, size, texture, swelling, inflammation, discoloration) and incorporate them into your reasoning and condition probabilities.
11. NEVER provide definitive diagnoses - always express uncertainty.
12. ALWAYS recommend consulting a healthcare professional in recommendations.
13. IMPORTANT: All human-readable strings in the JSON (condition names, descriptions, reasoning, followUpQuestions, etc.) MUST be written in ${lang}.
14. If informationCompleteness is below 80, you MUST generate 2-4 followUpQuestions to gather more data.

Return ONLY valid JSON in this exact format:
{
  "diagnosticConfidence": number (0-100),
  "informationCompleteness": number (0-100),
  "riskLevel": "critical" | "high" | "medium" | "low",
  "recommendation": ["string", "string"],
  "possibleConditions": [
    {
      "name": "Specific Medical Condition Name",
      "probability": number (must total 100 across all conditions),
      "description": "Brief clinical description of this condition in context of the symptoms"
    }
  ],
  "reasoning": ["bullet point reasoning"],
  "followUpQuestions": ["question 1", "question 2"] (REQUIRED if informationCompleteness < 80),
  "triageRecommendation": "EMERGENCY_ROOM" | "URGENT_CARE" | "ROUTINE_CONSULTATION" | "SELF_CARE",
  "redFlags": ["warning sign 1", "warning sign 2"] (symptoms that require immediate attention),
  "selfCareTips": ["tip 1", "tip 2"] (safe self-care measures),
  "commonTriggers": ["trigger 1", "trigger 2"] (potential causes or aggravating factors),
  "trackingAdvice": ["advice 1", "advice 2"] (what to monitor and track),
  "clinicalNextSteps": ["step 1", "step 2"] (recommended clinical actions)
}

Guidelines:
- Use SPECIFIC medical condition names (e.g., "Acute Pharyngitis", "Migraine", "Gastroenteritis", "Contact Dermatitis")
- Each analysis must be UNIQUE based on the actual symptoms described
- Probabilities across all conditions MUST sum to 100
- Include 2-5 possible conditions ranked by probability
- Provide 2-4 follow-up questions to gather more information (MANDATORY if informationCompleteness < 80)
- Include 2-3 safety-focused recommendations
- triageRecommendation should match riskLevel: critical/high → EMERGENCY_ROOM or URGENT_CARE, medium → ROUTINE_CONSULTATION, low → SELF_CARE or ROUTINE_CONSULTATION
- redFlags should highlight symptoms requiring immediate medical attention
- selfCareTips should be safe, evidence-based suggestions
- commonTriggers should identify potential causes or aggravating factors
- trackingAdvice should guide what to monitor
- clinicalNextSteps should outline recommended medical actions
- Be medically cautious and safety-first
- If unsure, lower confidence rather than hallucinating
- If an image is provided, analyze visual characteristics and incorporate them into reasoning

Examples of GOOD condition names:
- "Viral Upper Respiratory Infection"
- "Tension Headache"  
- "Acute Gastritis"
- "Allergic Rhinitis"
- "Musculoskeletal Strain"
- "Contact Dermatitis"
- "Atopic Dermatitis"

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
    // If imageBase64 is provided, attach it to the latest user message
    const conversationHistory = messages.map((msg, index) => {
      const isLatestUserMessage = index === messages.length - 1 && msg.role === 'user';
      const hasImage = (msg.imageUrl || (isLatestUserMessage && imageBase64));
      const imageToUse = isLatestUserMessage && imageBase64 ? imageBase64 : msg.imageUrl;
      
      if (hasImage && msg.role === 'user') {
        // Format image URL properly - OpenAI expects data URLs or URLs
        const imageUrl = imageToUse?.startsWith('data:') ? imageToUse : `data:image/jpeg;base64,${imageToUse}`;
        return {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: msg.content || 'Please analyze this image' },
            {
              type: 'image_url' as const,
              image_url: { url: imageUrl },
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

    // Ensure conditions have descriptions
    const conditionsWithDescriptions = result.possibleConditions.map((cond: any) => ({
      name: cond.name || 'Unknown Condition',
      probability: cond.probability || 0,
      description: cond.description || 'No description available',
    }));

    return {
      possibleConditions: conditionsWithDescriptions,
      reasoning: result.reasoning || [],
      confidenceScore: Math.min(100, Math.max(0, confidenceScore)),
      informationCompleteness: Math.min(100, Math.max(0, result.informationCompleteness || 0)),
      followUpQuestions: result.followUpQuestions || [],
      riskLevel: result.riskLevel || 'medium',
      recommendation,
      triageRecommendation: result.triageRecommendation || 'ROUTINE_CONSULTATION',
      redFlags: result.redFlags || [],
      selfCareTips: result.selfCareTips || [],
      commonTriggers: result.commonTriggers || [],
      trackingAdvice: result.trackingAdvice || [],
      clinicalNextSteps: result.clinicalNextSteps || [],
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

    const isHighRisk = riskLevel === 'high';

    const fallback: AIAnalysisResult = {
      possibleConditions: [
        {
          name: conditionName,
          probability: 70,
          description: 'This condition is based on common symptom patterns and requires professional evaluation.',
        },
        {
          name: 'Other causes not fully specified by current information',
          probability: 30,
          description: 'Additional information may help narrow down the possible causes.',
        },
      ],
      reasoning: [
        'The description of your symptoms matches common patterns seen in similar conditions.',
        'This is an approximate assessment based on the words you used to describe your problem.',
      ],
      confidenceScore: 40,
      informationCompleteness: 40,
      followUpQuestions: [
        'Can you describe the severity of your symptoms on a scale of 1-10?',
        'How long have these symptoms been present?',
        'Are there any factors that make the symptoms better or worse?',
      ],
      riskLevel,
      recommendation: [
        'Use this information only as a general guide, not as a diagnosis.',
        'Consult with a healthcare professional for proper evaluation, especially if symptoms worsen or feel severe.',
      ],
      triageRecommendation: isHighRisk ? 'URGENT_CARE' : 'ROUTINE_CONSULTATION',
      redFlags: isHighRisk
        ? ['Severe symptoms require immediate medical attention']
        : [],
      selfCareTips: [
        'Rest and stay hydrated',
        'Monitor your symptoms closely',
      ],
      commonTriggers: [],
      trackingAdvice: [
        'Keep track of symptom severity and frequency',
        'Note any changes in your condition',
      ],
      clinicalNextSteps: [
        'Schedule an appointment with a healthcare provider',
        'Bring a detailed symptom history to your appointment',
      ],
    };

    return fallback;
  }
}
