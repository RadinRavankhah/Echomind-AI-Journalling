export enum AppScreen {
  AUTH_GATE = 'AUTH_GATE',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  REFLECTION_FLOW = 'REFLECTION_FLOW',
  LIBRARY = 'LIBRARY',
  ENTRY_DETAIL = 'ENTRY_DETAIL',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS'
}

export interface Question {
  id: number;
  key: string;
  text: string;
  type: 'text' | 'slider';
}

export interface JournalEntry {
  id: string;
  title: string;
  intensity: number;
  date: string;
  responses: Record<string, string | number>;
  reflection?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AnalyticsOverview {
  streak: number;
  entry_frequency: { date: string; count: number }[];
  reflection_coverage: {
    total_responses: number;
    reflected_responses: number;
    coverage: number;
  };
  emotional_trends: [string, number][];
}

export interface User {
  username: string;
}
