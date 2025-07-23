import { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const timeString = message.timestamp.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className='mb-4 message-enter flex justify-end'>
        <div className='max-w-xs bg-purple-400 text-white rounded-2xl px-4 py-3 shadow-sm'>
          <p className='text-sm whitespace-pre-wrap'>{message.message}</p>
          <span className='text-xs text-purple-100 mt-1 block'>
            {timeString}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='mb-6 message-enter'>
      <div className='relative max-w-xs bg-white/95 rounded-2xl px-4 py-3 chat-bubble border border-purple-300/40 shadow-sm'>
        <p className='text-gray-800 text-sm whitespace-pre-wrap'>
          {message.message}
        </p>
        <span className='text-xs text-gray-600 mt-1 block'>{timeString}</span>
      </div>
    </div>
  );
}
