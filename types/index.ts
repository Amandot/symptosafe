export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Condition {
  name: string;
  probability: number;
}

export interface AIAnalysisResult {
  possibleConditions: Condition[];
  reasoning: string[];
  confidenceScore: number;
  informationCompleteness: number;
  followUpQuestions: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface EmergencyResult {
  isEmergency: boolean;
  emergencyType?: string;
  message?: string;
}

export interface SymptomSession {
  id: string;
  userId?: string;
  messages: Message[];
  analysis?: AIAnalysisResult;
  emergency?: EmergencyResult;
  timestamp: Date;
  language: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type Language = 'en' | 'hi' | 'mr';
