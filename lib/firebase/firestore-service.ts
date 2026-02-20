import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  type DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { SymptomSession } from '@/types';

const SESSIONS_COLLECTION = 'symptom_sessions';

function deepRemoveUndefined<T>(value: T): T {
  // Firestore rejects `undefined` anywhere in the object graph (even nested).
  if (value === undefined || value === null) return value;

  // Keep special values as-is
  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value
      .filter((v) => v !== undefined)
      .map((v) => deepRemoveUndefined(v)) as T;
  }

  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = deepRemoveUndefined(v);
    }
    return out as T;
  }

  return value;
}

export async function saveSession(session: SymptomSession): Promise<string> {
  if (!db || !isFirebaseConfigured) {
    console.warn(
      'Firebase is not configured (missing NEXT_PUBLIC_FIREBASE_* env vars). Session will not be saved.'
    );
    return '';
  }

  try {
    if (!session.userId) {
      console.warn('No userId provided. Session will not be saved. Make sure the user is signed in.');
      return '';
    }

    const baseSession = {
      ...(session.id ? { id: session.id } : {}),
      userId: session.userId,
      messages: session.messages,
      timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
      language: session.language,
      ...(session.analysis ? { analysis: session.analysis } : {}),
      ...(session.emergency ? { emergency: session.emergency } : {}),
    };

    const cleanSession = deepRemoveUndefined(baseSession);
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), cleanSession);

    console.log('Session saved to Firestore:', {
      collection: SESSIONS_COLLECTION,
      docId: docRef.id,
      userId: session.userId,
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
      if (code === 'invalid-argument') {
        console.warn('Firestore rejected session payload (invalid-argument). Skipping persistence.', error);
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
    // Try reading from the new subcollection path first: users/{userId}/sessions
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const q = query(
      sessionsRef,
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const sessions: SymptomSession[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      sessions.push({
        id: doc.id,
        userId: userId,
        messages: data.messages || [],
        analysis: data.analysis,
        emergency: data.emergency,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
        language: data.language || 'en',
      });
    });

    // If no sessions found in new location, try old collection for backward compatibility
    if (sessions.length === 0) {
      const oldQ = query(
        collection(db, SESSIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(maxResults)
      );

      const oldQuerySnapshot = await getDocs(oldQ);
      oldQuerySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        sessions.push({
          id: doc.id,
          userId: data.userId,
          messages: data.messages,
          analysis: data.analysis,
          emergency: data.emergency,
          timestamp: data.timestamp.toDate(),
          language: data.language,
        });
      });
    }

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


