import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const PREDICTIVE_SYSTEM_PROMPT = `You are a health pattern analysis AI. Analyze the user's symptom history to identify patterns and predict potential health risks.

Your task:
1. Identify recurring patterns (e.g., symptoms occurring on specific days, times, or after certain activities)
2. Calculate a 30-day risk score (0-100%) for developing chronic conditions based on trends
3. Provide actionable recommendations

Response Format (JSON only):
{
  "insights": {
    "pattern": "Description of identified pattern",
    "riskScore": 0-100,
    "recommendation": "Specific actionable advice",
    "confidence": 0-100
  },
  "riskScore": 0-100
}

Guidelines:
- Look for temporal patterns (day of week, time of day)
- Consider symptom frequency and severity trends
- Identify potential environmental or lifestyle triggers
- Be conservative with risk scores
- Provide specific, actionable recommendations`;

export async function POST(request: NextRequest) {
  try {
    const { sessions } = await request.json();

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({
        insights: {
          pattern: 'Insufficient data for pattern analysis',
          riskScore: 0,
          recommendation: 'Continue logging symptoms to enable predictive insights',
          confidence: 0,
        },
        riskScore: 0,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({ apiKey });

    // Prepare session summary for AI
    const sessionSummary = sessions.map((s: any, idx: number) => {
      const date = new Date(s.timestamp);
      return `Session ${idx + 1} (${date.toLocaleDateString()} ${date.toLocaleTimeString()}):
- Risk Level: ${s.analysis?.riskLevel || 'unknown'}
- Conditions: ${s.analysis?.possibleConditions?.map((c: any) => c.name).join(', ') || 'none'}
- Messages: ${s.messages?.map((m: any) => m.content).join(' | ') || 'none'}`;
    }).join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: PREDICTIVE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze these symptom sessions and identify patterns:\n\n${sessionSummary}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);

    return NextResponse.json({
      insights: result.insights || {
        pattern: 'Pattern analysis in progress',
        riskScore: 25,
        recommendation: 'Continue monitoring symptoms',
        confidence: 50,
      },
      riskScore: result.riskScore || 25,
    });
  } catch (error) {
    console.error('Prediction error:', error);

    // Fallback response
    return NextResponse.json({
      insights: {
        pattern: 'Unable to analyze patterns at this time',
        riskScore: 25,
        recommendation: 'Continue logging symptoms and consult a healthcare provider if symptoms persist',
        confidence: 30,
      },
      riskScore: 25,
    });
  }
}
