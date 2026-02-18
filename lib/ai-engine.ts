import OpenAI from 'openai';
import type { AIAnalysisResult, Message } from '@/types';

const SYSTEM_PROMPT = `You are a medical symptom analysis assistant. Your role is to help users understand their symptoms, but you are NOT a replacement for professional medical care.

CRITICAL RULES:
1. NEVER provide definitive diagnoses
2. ALWAYS express uncertainty and limitations
3. ALWAYS recommend consulting a healthcare professional
4. Provide differential diagnoses with probability estimates
5. Ask clarifying questions to gather more information
6. Be transparent about confidence levels

Response Format (JSON only):
{
  "possibleConditions": [
    { "name": "Condition Name", "probability": 0-100 }
  ],
  "reasoning": ["reason 1", "reason 2"],
  "confidenceScore": 0-100,
  "informationCompleteness": 0-100,
  "followUpQuestions": ["question 1", "question 2"],
  "riskLevel": "critical" | "high" | "medium" | "low"
}

Guidelines:
- confidenceScore < 50: Strongly recommend seeing a doctor
- informationCompleteness: How much information you have (0-100)
- riskLevel based on symptom severity
- Always include 2-4 follow-up questions
- List 2-5 possible conditions with probabilities
- Probabilities should reflect uncertainty`;

export async function analyzeSymptoms(
  messages: Message[],
  apiKey: string
): Promise<AIAnalysisResult> {
  try {
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const conversationHistory = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result: AIAnalysisResult = JSON.parse(content);

    // Validate and ensure all required fields
    if (!result.possibleConditions || !Array.isArray(result.possibleConditions)) {
      throw new Error('Invalid AI response format');
    }

    return {
      possibleConditions: result.possibleConditions || [],
      reasoning: result.reasoning || [],
      confidenceScore: Math.min(100, Math.max(0, result.confidenceScore || 0)),
      informationCompleteness: Math.min(100, Math.max(0, result.informationCompleteness || 0)),
      followUpQuestions: result.followUpQuestions || [],
      riskLevel: result.riskLevel || 'medium'
    };
  } catch (error) {
    console.error('AI Analysis Error, falling back to local heuristic:', error);

    // Fallback: basic, non-AI heuristic so the UI continues to work
    const latest = messages[messages.length - 1];
    const text = latest?.content?.toLowerCase?.() ?? '';

    let riskLevel: AIAnalysisResult['riskLevel'] = 'medium';
    if (text.includes('severe') || text.includes('worst pain')) {
      riskLevel = 'high';
    }

    const fallback: AIAnalysisResult = {
      possibleConditions: [
        {
          name: 'General symptom pattern (demo)',
          probability: 45,
        },
        {
          name: 'Needs clinical evaluation',
          probability: 55,
        },
      ],
      reasoning: [
        'The AI service is currently unavailable, so this is a local approximation.',
        'Your description suggests symptoms that should be reviewed by a clinician.',
      ],
      confidenceScore: 40,
      informationCompleteness: 40,
      followUpQuestions: [
        'When did these symptoms start, and have they been getting better or worse?',
        'Do you have any other symptoms such as fever, chest pain, shortness of breath, or severe headache?',
      ],
      riskLevel,
    };

    return fallback;
  }
}
