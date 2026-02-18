import { create } from 'zustand';
import type { User, Message, AIAnalysisResult, EmergencyResult, Language } from '@/types';

interface AppState {
  user: User | null;
  messages: Message[];
  analysis: AIAnalysisResult | null;
  emergency: EmergencyResult | null;
  isLoading: boolean;
  language: Language;
  caregiverMode: boolean;
  
  setUser: (user: User | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setAnalysis: (analysis: AIAnalysisResult | null) => void;
  setEmergency: (emergency: EmergencyResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLanguage: (language: Language) => void;
  setCaregiverMode: (caregiverMode: boolean) => void;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  messages: [],
  analysis: null,
  emergency: null,
  isLoading: false,
  language: 'en',
  caregiverMode: false,
  
  setUser: (user) => set({ user }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setAnalysis: (analysis) => set({ analysis }),
  setEmergency: (emergency) => set({ emergency }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLanguage: (language) => set({ language }),
  setCaregiverMode: (caregiverMode) => set({ caregiverMode }),
  resetSession: () => set({ messages: [], analysis: null, emergency: null }),
}));
