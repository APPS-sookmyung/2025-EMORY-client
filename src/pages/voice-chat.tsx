import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSpeechRecognition } from '/hooks/useSpeechRecognition';
import { ChatHeader } from '@/components/voice-chat/ChatHeader';
import { VoiceButton } from '@/components/voice-chat/VoiceButton';
import { ChatMessage } from '@/components/voice-chat/ChatMessage';
import { LoadingIndicator } from '@/components/voice-chat/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export default function VoiceChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('Emory agent 와 대화하세요...');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    isListening,
    isProcessing,
    error,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    processTranscript,
    isSupported,
  } = useSpeechRecognition();

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessages: ChatMessageType[] = [
      {
        id: '1',
        type: 'ai',
        message: 'Hello! 안녕하세요!',
        timestamp: new Date(),
      },
      {
        id: '2',
        type: 'ai',
        message: 'How are you today?',
        timestamp: new Date(Date.now() + 1000),
      },
    ];
    setMessages(welcomeMessages);
  }, []);

  // Handle speech recognition results
  useEffect(() => {
    if (isProcessing && transcript && transcript.trim()) {
      // 실제 사용자 음성을 텍스트로 받아적기 (백엔드 연동 없이)
      console.log('Processing transcript:', transcript);
      addUserMessage(transcript.trim());
      resetTranscript();
      simulateAIResponse();
    }
  }, [isProcessing, transcript]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: '음성 인식 오류',
        description: error,
        variant: 'destructive',
      });
      setStatusText(error);
    }
  }, [error, toast]);

  // Update status text based on listening state
  useEffect(() => {
    if (isListening) {
      setStatusText(
        '듣고 있습니다... 말이 끝나면 마이크 버튼을 다시 눌러주세요'
      );
    } else if (isLoading) {
      setStatusText('Emory agent is speaking...');
    } else if (!error) {
      setStatusText('');
    }
  }, [isListening, isLoading, error]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const addUserMessage = (message: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const addAIMessage = (message: string) => {
    const aiMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'ai',
      message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const simulateAIResponse = () => {
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      setIsLoading(false);

      const responses = [
        '[예시 AI 대화] 그 감정을 조금 더 자세히 설명해주실 수 있나요?',
        '[예시 AI 대화] 오늘 어떤 일이 있었는지 말씀해주세요.',
        '[예시 AI 대화] 그 순간에 어떤 생각이 들었는지 궁금해요.',
        '[예시 AI 대화] 비슷한 경험을 했을 때는 어떠셨나요?',
        '[예시 AI 대화] 지금 기분은 어떠신가요?',
        '[예시 AI 대화] 그런 기분이 들 때 보통 어떻게 하시나요?',
        '[예시 AI 대화] 더 말씀해주고 싶은 게 있으신가요?',
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addAIMessage(randomResponse);
    }, 1500);
  };

  const handleVoiceClick = () => {
    console.log(
      'Voice button clicked, isListening:',
      isListening,
      'transcript:',
      transcript
    );

    if (!isSupported) {
      toast({
        title: '음성 인식 불가',
        description: '이 브라우저는 음성 인식을 지원하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      // 사용자가 말 완료했을 때 마이크 버튼으로 중단
      console.log('Stopping listening...');
      stopListening();

      // 0.5초 후에 transcript가 있으면 처리
      setTimeout(() => {
        if (transcript && transcript.trim()) {
          console.log('Processing transcript after stop:', transcript);
          addUserMessage(transcript.trim());
          resetTranscript();
          simulateAIResponse();
          toast({
            title: '음성 입력 완료',
            description: '음성을 텍스트로 변환했습니다.',
          });
        }
      }, 500);
    } else {
      console.log('Starting listening...');
      startListening();
    }
  };

  const handleMenuClick = () => {
    toast({
      title: '메뉴',
      description: '메뉴 기능은 향후 구현 예정입니다.',
    });
  };

  const handleProfileClick = () => {
    // 아직 구현 X - 프로필 기능
    toast({
      title: '프로필',
      description: '프로필 기능은 향후 구현 예정입니다.',
    });
  };

  const handleKeyboardClick = () => {
    // 아직 구현 X
    toast({
      title: '키보드 입력',
      description: '키보드 입력 기능은 향후 구현 예정입니다.',
    });
  };

  const handleStopClick = () => {
    // 아직 구현 X - 음성 녹음 중단 기능
    if (isListening) {
      stopListening();
    }
    toast({
      title: '녹음 중단',
      description: '녹음이 중단되었습니다.',
    });
  };

  const handleFinishChat = () => {
    // 아직 구현 X - 초기 화면으로 돌아가기
    const confirmed = window.confirm('대화를 종료하시겠습니까?');
    if (confirmed) {
      // Reset to initial state
      setMessages([
        {
          id: '1',
          type: 'ai',
          message: 'Hello! 안녕하세요!',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'ai',
          message: 'How are you today?',
          timestamp: new Date(Date.now() + 1000),
        },
      ]);
      setIsLoading(false);
      setStatusText('Emory agent 와 대화하세요...');
      toast({
        title: '대화 초기화',
        description: '새로운 대화를 시작할 수 있습니다.',
      });
    }
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
        className={`flex-1 overflow-y-auto px-4 pb-4 transition-all duration-300 ${isListening || isLoading ? 'chat-blur' : ''}`}
        style={{ height: 'calc(844px - 300px)', minHeight: '500px' }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <LoadingIndicator />}
      </div>

      {/* Dark overlay when listening or processing */}
      {(isListening || isLoading) && (
        <div className='overlay-dark flex flex-col items-center justify-center'>
          {isListening && (
            <>
              {/* Listening animation */}
              <div className='relative w-32 h-32 mb-8'>
                {/* Main circle with pulsing effect */}
                <div className='absolute inset-0 rounded-full bg-white/20 animate-pulse'></div>

                {/* Sound wave rings */}
                <div className='absolute inset-4 rounded-full border-2 border-white/40 animate-ping'></div>
                <div
                  className='absolute inset-8 rounded-full border border-white/30'
                  style={{ animation: 'wave-pulse 1.5s infinite 0.3s' }}
                ></div>

                {/* Center microphone representation */}
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80'></div>
              </div>

              {/* Listening text */}
              <p className='text-white/90 text-lg font-medium tracking-wide'>
                듣고 있습니다...
              </p>
            </>
          )}
          {isLoading && (
            <>
              {/* Siri-style animated circle */}
              <div className='relative w-32 h-32 mb-8'>
                {/* Main circle */}
                <div className='absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 opacity-80'></div>

                {/* Animated rings */}
                <div className='absolute inset-2 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-60 animate-pulse'></div>
                <div className='absolute inset-4 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 opacity-40 animate-ping'></div>

                {/* Center dot */}
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-80'></div>

                {/* Outer glow ring */}
                <div className='absolute -inset-4 rounded-full border-2 border-white/20 animate-spin'></div>
              </div>

              {/* Speaking text */}
              <p className='text-white/90 text-lg font-medium tracking-wide'>
                Emory agent is speaking
              </p>
            </>
          )}
        </div>
      )}

      {/* Voice Input Section */}
      <VoiceButton
        isListening={isListening}
        isProcessing={isProcessing}
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
