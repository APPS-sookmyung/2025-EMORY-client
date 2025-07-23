import { useState, useEffect } from 'react';
import { Mic, Keyboard, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';

// 음성 인식 제어 버튼 컴포넌트
// - 음성 인식 시작/중지, 키보드 입력 전환 기능 포함

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onVoiceClick: () => void;
  onKeyboardClick: () => void;
  onStopClick: () => void;
}

export function VoiceButton({
  isListening,
  isProcessing,
  onVoiceClick,
  onKeyboardClick,
  onStopClick,
}: VoiceButtonProps) {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (isListening) {
      setPulseKey((prev) => prev + 1);
    }
  }, [isListening]);

  return (
    <div className='relative flex-shrink-0 pb-8'>
      {/* Side buttons */}
      <div className='absolute left-8 bottom-16 flex flex-col space-y-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onKeyboardClick}
          className='w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-gray-600 border border-white/30'
        >
          <Keyboard className='w-6 h-6' />
        </Button>
      </div>

      <div className='absolute right-8 bottom-16 flex flex-col space-y-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onStopClick}
          className='w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-gray-600 border border-white/30'
        >
          <X className='w-6 h-6' />
        </Button>
      </div>

      {/* Central Voice Button */}
      <div className='flex justify-center'>
        <motion.button
          onClick={onVoiceClick}
          className={`relative w-24 h-24 voice-button-gradient rounded-full voice-button-shadow flex items-center justify-center ${isListening ? 'voice-button-listening' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening || isProcessing ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Wave pulse animation rings */}
          {isListening && (
            <>
              <motion.div
                key={`wave-1-${pulseKey}`}
                className='absolute inset-0 rounded-full border-2 border-white/50'
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                key={`wave-2-${pulseKey}`}
                className='absolute inset-0 rounded-full border-2 border-white/40'
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.4,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                key={`wave-3-${pulseKey}`}
                className='absolute inset-0 rounded-full border border-white/30'
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.8,
                  ease: 'easeOut',
                }}
              />
            </>
          )}

          {/* Microphone icon */}
          <Mic className='w-8 h-8 text-white' />
        </motion.button>
      </div>
    </div>
  );
}
