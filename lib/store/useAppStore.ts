import { create } from 'zustand';
import type { User, Message, AIAnalysisResult, EmergencyResult, Language, SymptomSession } from '@/types';

type TabId = 'checker' | 'insights' | 'hospitals' | 'profile';

interface AppState {
  user: User | null;
  messages: Message[];
  analysis: AIAnalysisResult | null;
  emergency: EmergencyResult | null;
  isLoading: boolean;
  language: Language;
  caregiverMode: boolean;
  activeTab: TabId;
  historyLogs: SymptomSession[];
  currentRiskScore: number;
  
  setUser: (user: User | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setAnalysis: (analysis: AIAnalysisResult | null) => void;
  setEmergency: (emergency: EmergencyResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLanguage: (language: Language) => void;
  setCaregiverMode: (caregiverMode: boolean) => void;
  setActiveTab: (tab: TabId) => void;
  setHistoryLogs: (logs: SymptomSession[]) => void;
  setCurrentRiskScore: (score: number) => void;
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
  activeTab: 'checker',
  historyLogs: [],
  currentRiskScore: 0,
  
  setUser: (user) => set({ user }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setAnalysis: (analysis) => set({ analysis }),
  setEmergency: (emergency) => set({ emergency }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLanguage: (language) => set({ language }),
  setCaregiverMode: (caregiverMode) => set({ caregiverMode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHistoryLogs: (logs) => set({ historyLogs: logs }),
  setCurrentRiskScore: (score) => set({ currentRiskScore: score }),
  resetSession: () => set({ messages: [], analysis: null, emergency: null }),
}));
