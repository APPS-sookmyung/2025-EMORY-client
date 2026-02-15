import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeChat } from '../hooks/useRealtimeChat';
import { ChatHeader } from '../components/voice-chat/ChatHeader';
import { VoiceButton } from '../components/voice-chat/VoiceButton';
import { ChatMessage } from '../components/voice-chat/ChatMessage';
import { LoadingIndicator } from '../components/voice-chat/LoadingIndicator';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useLocation } from 'wouter';

export default function VoiceChat() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const hasConnectedRef = useRef(false);

  const {
    status,
    messages,
    error,
    isAiSpeaking,
    connect,
    disconnect,
    toggleMute,
    isMuted,
  } = useRealtimeChat();

  // Auto-connect on mount
  useEffect(() => {
    if (hasConnectedRef.current) return;
    hasConnectedRef.current = true;

    connect({
      selectedEmotion: 'neutral',
      calendarSummary: '',
    });
  }, [connect]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: '연결 오류',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiSpeaking]);

  const isConnecting = status === 'connecting';
  const isActive = status === 'connected' || status === 'ai-speaking';

  const statusText = (() => {
    switch (status) {
      case 'connecting':
        return '연결 중입니다...';
      case 'connected':
        return isMuted ? '마이크가 꺼져 있습니다' : '';
      case 'ai-speaking':
        return 'Emory agent is speaking...';
      case 'error':
        return error || '오류가 발생했습니다';
      case 'disconnected':
        return '연결이 종료되었습니다';
      default:
        return '';
    }
  })();

  const handleVoiceClick = () => {
    if (!isActive) {
      if (status === 'error' || status === 'disconnected' || status === 'idle') {
        // Retry connection
        hasConnectedRef.current = false;
        connect({
          selectedEmotion: 'neutral',
          calendarSummary: '',
        });
      }
      return;
    }
    toggleMute();
  };

  const handleMenuClick = () => {};

  const handleProfileClick = () => {
    navigate('/my-page');
  };

  const handleKeyboardClick = () => {
    toast({
      title: '키보드 입력',
      description: '키보드 입력 기능은 향후 구현 예정입니다.',
    });
  };

  const handleStopClick = () => {
    if (!isMuted && isActive) {
      toggleMute();
      toast({
        title: '마이크 끔',
        description: '마이크가 꺼졌습니다.',
      });
    }
  };

  const handleFinishChat = async () => {
    const confirmed = window.confirm(
      '대화를 종료하고 감정 리포트를 확인하시겠습니까?',
    );
    if (!confirmed) return;

    await disconnect();
    navigate('/loading?redirect=emotion-report');
  };

  return (
    <div className='gradient-bg flex flex-col relative'>
      <ChatHeader
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-4 transition-all duration-300 custom-scrollbar ${isAiSpeaking ? 'chat-blur' : ''}`}
        style={{ minHeight: '40vh', maxHeight: 'calc(100vh - 320px)' }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isConnecting && <LoadingIndicator />}
      </div>

      {/* Dark overlay when AI is speaking */}
      {isAiSpeaking && (
        <div className='overlay-dark flex flex-col items-center justify-center'>
          {/* Siri-style animated circle */}
          <div className='relative w-32 h-32 mb-8'>
            <div className='absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 opacity-80'></div>
            <div className='absolute inset-2 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-60 animate-pulse'></div>
            <div className='absolute inset-4 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 opacity-40 animate-ping'></div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-80'></div>
            <div className='absolute -inset-4 rounded-full border-2 border-white/20 animate-spin'></div>
          </div>

          <p className='text-white/90 text-lg font-medium tracking-wide'>
            Emory agent is speaking
          </p>
        </div>
      )}

      {/* Voice Input Section */}
      <VoiceButton
        isListening={isActive && !isMuted}
        isProcessing={isConnecting}
        onVoiceClick={handleVoiceClick}
        onKeyboardClick={handleKeyboardClick}
        onStopClick={handleStopClick}
      />

      {/* Status Text */}
      {statusText && (
        <div className='text-center mt-4'>
          <motion.p
            className='text-white/90 text-sm drop-shadow-sm'
            key={statusText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {statusText}
          </motion.p>
        </div>
      )}

      {/* Finish Chat Button */}
      <div className='flex justify-center mt-2 pb-8'>
        <Button
          onClick={handleFinishChat}
          className='bg-white/20 hover:bg-white/30 text-gray-700 font-medium py-2 px-6 rounded-full shadow-lg transition-colors border border-white/30 text-sm'
        >
          Finish Chat
        </Button>
      </div>
    </div>
  );
}
