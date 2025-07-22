export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
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
