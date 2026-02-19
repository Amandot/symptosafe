import { NextRequest, NextResponse } from 'next/server';
import { analyzeSymptoms } from '@/lib/ai-engine';
import { detectEmergency } from '@/lib/safety-engine';
import type { Message } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { messages, image, language } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Invalid request: last message must be from user' },
        { status: 400 }
      );
    }

    // Step 1: Safety check (runs before AI)
    const emergencyResult = detectEmergency(latestMessage.content);
    
    if (emergencyResult.isEmergency) {
      return NextResponse.json({
        emergency: emergencyResult,
        analysis: null
      });
    }

    // Step 2: AI Analysis with optional image
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const analysis = await analyzeSymptoms(messages as Message[], apiKey, image, language);

    return NextResponse.json({
      emergency: emergencyResult,
      analysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
