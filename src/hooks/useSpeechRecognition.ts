import { useState, useRef, useCallback } from 'react';
import { SpeechRecognitionState } from '../types/chat';

interface UseSpeechRecognitionReturn extends SpeechRecognitionState {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  processTranscript: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isProcessing: false,
    error: null,
    transcript: '',
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onstart = () => {
      setState((prev) => ({
        ...prev,
        isListening: true,
        error: null,
      }));
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      setState((prev) => ({
        ...prev,
        transcript,
      }));

      // Final result처리는 onend에서 처리
    };

    recognition.onerror = (event) => {
      let errorMessage = '음성 인식에 오류가 발생했습니다.';

      switch (event.error) {
        case 'no-speech':
          errorMessage = '음성이 감지되지 않았습니다. 다시 시도해주세요.';
          break;
        case 'audio-capture':
          errorMessage = '마이크에 접근할 수 없습니다. 권한을 확인해주세요.';
          break;
        case 'not-allowed':
          errorMessage = '마이크 사용 권한이 거부되었습니다.';
          break;
        case 'network':
          errorMessage = '네트워크 오류가 발생했습니다.';
          break;
      }

      setState((prev) => ({
        ...prev,
        isListening: false,
        isProcessing: false,
        error: errorMessage,
      }));
    };

    recognition.onend = () => {
      setState((prev) => ({
        ...prev,
        isListening: false,
        isProcessing: prev.transcript ? true : false, // transcript가 있으면 처리 상태로
      }));
    };

    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: '이 브라우저는 음성 인식을 지원하지 않습니다.',
      }));
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (recognitionRef.current && !state.isListening) {
      setState((prev) => ({
        ...prev,
        error: null,
        transcript: '',
      }));
      recognitionRef.current.start();
    }
  }, [isSupported, state.isListening, initializeRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const resetTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: '',
      error: null,
      isProcessing: false,
    }));
  }, []);

  // Add a method to manually trigger processing
  const processTranscript = useCallback(() => {
    if (state.transcript && state.transcript.trim()) {
      setState((prev) => ({
        ...prev,
        isProcessing: true,
      }));
    }
  }, [state.transcript]);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    processTranscript,
    isSupported,
  };
}
