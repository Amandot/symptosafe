import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import type { User } from '@/types';

export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add Firebase credentials to .env.local');
  }
  const result = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(result.user);
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add Firebase credentials to .env.local');
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(result.user);
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add Firebase credentials to .env.local');
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(result.user);
}

export async function logout(): Promise<void> {
  if (!auth || !isFirebaseConfigured) {
    return;
  }
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth || !isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL
  };
}
