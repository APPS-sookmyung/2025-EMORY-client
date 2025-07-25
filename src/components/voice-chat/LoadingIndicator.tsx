export function LoadingIndicator() {
  return (
    <div className='mb-6 message-enter'>
      <div className='relative max-w-xs bg-white/95 rounded-2xl px-4 py-3 chat-bubble border border-purple-300/40 shadow-sm'>
        <div className='flex items-center space-x-2'>
          <div className='flex space-x-1'>
            <div className='w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce'></div>
            <div
              className='w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
          <span className='text-purple-700 text-xs ml-2 font-medium'>
            Speaking...
          </span>
        </div>
      </div>
    </div>
  );
}
