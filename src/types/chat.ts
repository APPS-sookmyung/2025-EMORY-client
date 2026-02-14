export type MessageType = 'user' | 'ai';
export interface ChatMessage {
  id: string;
  type: MessageType;
  message: string;
  timestamp: Date;
}

export interface SpeechRecognitionState {
  isListening: boolean;
  isProcessing: boolean;
  error: string | null;
  transcript: string;
}

export interface VoiceChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  statusText: string;
}

// --- Realtime Chat API Types ---

export interface ChatStartRequest {
  selectedEmotion: string;
  calendarSummary: string;
}

export interface ChatStartResponse {
  sessionId: string;
}

export interface ClientSecretResponse {
  clientSecret: string;
  expiresAt: number;
}

export interface ChatSaveMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSaveRequest {
  sessionId: string;
  messages: ChatSaveMessage[];
}

export type RealtimeStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'ai-speaking'
  | 'error'
  | 'disconnected';
