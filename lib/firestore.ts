import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import type { AIAnalysisResult, Message } from '@/types';

/**
 * Interface for the analysis data to be saved to Firestore
 */
export interface AnalysisSessionData {
  analysis: AIAnalysisResult;
  userMessage: string; // The user's initial message
  messages: Message[]; // All messages in the conversation
  riskScore: number; // Calculated from riskLevel (CRITICAL=100, HIGH=75, MEDIUM=50, LOW=25)
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  primaryCondition: string | null; // The highest probability condition name
  timestamp: Date; // When the analysis was completed
}

/**
 * Calculates risk score from risk level
 */
function calculateRiskScore(riskLevel: 'critical' | 'high' | 'medium' | 'low'): number {
  const riskMap: Record<'critical' | 'high' | 'medium' | 'low', number> = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25,
  };
  return riskMap[riskLevel] || 25;
}

/**
 * Extracts the primary condition (highest probability) from analysis results
 */
function getPrimaryCondition(analysis: AIAnalysisResult): string | null {
  if (!analysis.possibleConditions || analysis.possibleConditions.length === 0) {
    return null;
  }
  
  // Sort by probability descending and get the first one
  const sortedConditions = [...analysis.possibleConditions].sort(
    (a, b) => (b.probability || 0) - (a.probability || 0)
  );
  
  return sortedConditions[0]?.name || null;
}

/**
 * Saves a completed symptom analysis session to Firestore
 * 
 * @param userId - The authenticated user's ID
 * @param analysisData - The AI's analysis result and user's initial message
 * @returns The document ID of the saved session, or empty string if save failed
 */
export async function saveSessionToFirestore(
  userId: string,
  analysisData: {
    analysis: AIAnalysisResult;
    userMessage: string;
    messages: Message[];
    language?: string;
  }
): Promise<string> {
  if (!db || !isFirebaseConfigured) {
    console.warn(
      'Firebase is not configured (missing NEXT_PUBLIC_FIREBASE_* env vars). Session will not be saved.'
    );
    return '';
  }

  if (!userId) {
    console.warn('No userId provided. Session will not be saved. Make sure the user is signed in.');
    return '';
  }

  try {
    // Calculate derived fields
    const riskScore = calculateRiskScore(analysisData.analysis.riskLevel);
    const primaryCondition = getPrimaryCondition(analysisData.analysis);
    const timestamp = new Date();

    // Prepare the session document
    const sessionData: Omit<AnalysisSessionData, 'timestamp'> & { 
      createdAt: ReturnType<typeof serverTimestamp>;
      timestamp: Date;
      language?: string;
    } = {
      analysis: analysisData.analysis,
      userMessage: analysisData.userMessage,
      messages: analysisData.messages,
      riskScore,
      riskLevel: analysisData.analysis.riskLevel,
      primaryCondition,
      timestamp,
      createdAt: serverTimestamp(), // Firebase server timestamp
      ...(analysisData.language && { language: analysisData.language }),
    };

    // Save to users/{userId}/sessions subcollection
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const docRef = await addDoc(sessionsRef, sessionData);

    console.log('Session saved to Firestore:', {
      collection: `users/${userId}/sessions`,
      docId: docRef.id,
      userId,
      riskScore,
      riskLevel: analysisData.analysis.riskLevel,
      primaryCondition,
    });

    return docRef.id;
  } catch (error: unknown) {
    // Handle Firestore errors gracefully
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code === 'permission-denied') {
        console.warn(
          'Firestore permission denied when saving session. Skipping persistence but keeping UI flow.'
        );
        return '';
      }
      if (code === 'invalid-argument') {
        console.warn('Firestore rejected session payload (invalid-argument). Skipping persistence.', error);
        return '';
      }
    }

    console.error('Error saving session to Firestore:', error);
    // Don't throw - allow UI to continue even if save fails
    return '';
  }
}

