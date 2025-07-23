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
