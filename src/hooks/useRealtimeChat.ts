import { useState, useRef, useCallback } from 'react';
import { chatService } from '../services/chatService';
import type {
  ChatMessage,
  ChatStartRequest,
  ChatSaveMessage,
  RealtimeStatus,
} from '../types/chat';

const REALTIME_API_URL =
  'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

interface UseRealtimeChatReturn {
  status: RealtimeStatus;
  messages: ChatMessage[];
  error: string | null;
  isAiSpeaking: boolean;
  connect: (request: ChatStartRequest) => Promise<void>;
  disconnect: () => Promise<void>;
  toggleMute: () => void;
  isMuted: boolean;
}

export function useRealtimeChat(): UseRealtimeChatReturn {
  const [status, setStatus] = useState<RealtimeStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const currentAiMessageIdRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current = null;
    }
    currentAiMessageIdRef.current = null;
  }, []);

  const connect = useCallback(
    async (request: ChatStartRequest) => {
      try {
        setStatus('connecting');
        setError(null);
        setMessages([]);

        // 1. Start session
        const { sessionId } = await chatService.startSession(request);
        sessionIdRef.current = sessionId;

        // 2. Get client secret
        const { clientSecret } = await chatService.getClientSecret(sessionId);

        // 3. Get microphone stream
        let micStream: MediaStream;
        try {
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
        } catch {
          throw new Error('마이크 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
        }
        micStreamRef.current = micStream;

        // 4. Create PeerConnection
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        // 5. Add mic track
        micStream.getTracks().forEach((track) => {
          pc.addTrack(track, micStream);
        });

        // 6. Handle remote audio
        const audioEl = document.createElement('audio');
        audioEl.autoplay = true;
        audioElRef.current = audioEl;

        pc.ontrack = (event) => {
          audioEl.srcObject = event.streams[0];
        };

        // 7. Monitor connection state
        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'failed') {
            setError('WebRTC 연결이 실패했습니다.');
            setStatus('error');
          } else if (pc.connectionState === 'disconnected') {
            setStatus('disconnected');
          }
        };

        // 8. Create DataChannel for events
        const dc = pc.createDataChannel('oai-events');
        dcRef.current = dc;

        dc.onopen = () => {
          setStatus('connected');
          // Send session.update to enable input audio transcription
          const sessionUpdate = {
            type: 'session.update',
            session: {
              input_audio_transcription: {
                model: 'whisper-1',
              },
            },
          };
          dc.send(JSON.stringify(sessionUpdate));
        };

        dc.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleRealtimeEvent(data);
          } catch {
            // Ignore non-JSON messages
          }
        };

        dc.onerror = () => {
          setError('DataChannel 에러가 발생했습니다.');
        };

        // 9. Create SDP offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // 10. Send offer to OpenAI Realtime API
        const sdpResponse = await fetch(REALTIME_API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        });

        if (!sdpResponse.ok) {
          throw new Error(
            `OpenAI Realtime 연결 실패: ${sdpResponse.status} ${sdpResponse.statusText}`,
          );
        }

        // 11. Set remote SDP answer
        const answerSdp = await sdpResponse.text();
        await pc.setRemoteDescription({
          type: 'answer',
          sdp: answerSdp,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '연결에 실패했습니다.';
        setError(message);
        setStatus('error');
        cleanup();
      }
    },
    [cleanup],
  );

  const handleRealtimeEvent = useCallback(
    (data: { type: string; [key: string]: unknown }) => {
      switch (data.type) {
        case 'conversation.item.input_audio_transcription.completed': {
          const transcript = (data as { transcript?: string }).transcript;
          if (transcript) {
            const userMsg: ChatMessage = {
              id: `user-${Date.now()}`,
              type: 'user',
              message: transcript,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);
          }
          break;
        }

        case 'response.created': {
          setIsAiSpeaking(true);
          setStatus('ai-speaking');
          // Create a new AI message placeholder
          const aiMsgId = `ai-${Date.now()}`;
          currentAiMessageIdRef.current = aiMsgId;
          const aiMsg: ChatMessage = {
            id: aiMsgId,
            type: 'ai',
            message: '',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          break;
        }

        case 'response.audio_transcript.delta': {
          const delta = (data as { delta?: string }).delta;
          if (delta && currentAiMessageIdRef.current) {
            const currentId = currentAiMessageIdRef.current;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentId
                  ? { ...msg, message: msg.message + delta }
                  : msg,
              ),
            );
          }
          break;
        }

        case 'response.audio_transcript.done': {
          const transcript = (data as { transcript?: string }).transcript;
          if (transcript && currentAiMessageIdRef.current) {
            const currentId = currentAiMessageIdRef.current;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentId
                  ? { ...msg, message: transcript }
                  : msg,
              ),
            );
          }
          break;
        }

        case 'response.done': {
          setIsAiSpeaking(false);
          setStatus('connected');
          currentAiMessageIdRef.current = null;
          break;
        }

        case 'error': {
          const errorMsg =
            (data as { error?: { message?: string } }).error?.message ||
            'Realtime API 에러가 발생했습니다.';
          setError(errorMsg);
          break;
        }
      }
    },
    [],
  );

  const disconnect = useCallback(async () => {
    const sessionId = sessionIdRef.current;

    if (sessionId) {
      try {
        await chatService.stopSession(sessionId);
      } catch {
        // Stop failure is non-critical
      }

      try {
        // Convert messages to save format
        const saveMessages: ChatSaveMessage[] = messages
          .filter((msg) => msg.message.trim() !== '')
          .map((msg) => ({
            role: msg.type === 'user' ? ('user' as const) : ('assistant' as const),
            content: msg.message,
          }));

        if (saveMessages.length > 0) {
          await chatService.saveMessages({
            sessionId,
            messages: saveMessages,
          });
        }
      } catch {
        // Save failure is non-critical, we still navigate away
      }
    }

    cleanup();
    sessionIdRef.current = null;
    setStatus('disconnected');
    setIsAiSpeaking(false);
    setIsMuted(false);
  }, [messages, cleanup]);

  const toggleMute = useCallback(() => {
    if (micStreamRef.current) {
      const audioTrack = micStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  return {
    status,
    messages,
    error,
    isAiSpeaking,
    connect,
    disconnect,
    toggleMute,
    isMuted,
  };
}
