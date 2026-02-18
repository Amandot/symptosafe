import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  type DocumentData
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { SymptomSession } from '@/types';

const SESSIONS_COLLECTION = 'symptom_sessions';

export async function saveSession(session: SymptomSession): Promise<string> {
  if (!db || !isFirebaseConfigured) {
    console.warn('Firebase is not configured. Session will not be saved.');
    return '';
  }
  
  try {
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
      ...session,
      timestamp: new Date(session.timestamp)
    });
    return docRef.id;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code === 'permission-denied') {
        console.warn(
          'Firestore permission denied when saving session. Skipping persistence but keeping UI flow.'
        );
        return '';
      }
    }

    console.error('Error saving session:', error);
    throw new Error('Failed to save session');
  }
}

export async function getUserSessions(userId: string, maxResults = 10): Promise<SymptomSession[]> {
  if (!db || !isFirebaseConfigured) {
    console.warn('Firebase is not configured. Cannot fetch sessions.');
    return [];
  }
  
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const sessions: SymptomSession[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      sessions.push({
        id: doc.id,
        userId: data.userId,
        messages: data.messages,
        analysis: data.analysis,
        emergency: data.emergency,
        timestamp: data.timestamp.toDate(),
        language: data.language
      });
    });

    return sessions;
  } catch (error: unknown) {
    // Common in locked-down Firestore rules: permission-denied
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code === 'permission-denied') {
        console.warn(
          'Firestore permission denied when fetching sessions. Returning empty list instead of failing.'
        );
        return [];
      }
    }

    console.error('Error fetching sessions:', error);
    throw new Error('Failed to fetch sessions');
  }
}
