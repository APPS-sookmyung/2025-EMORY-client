import { Menu, User } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ChatHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

export function ChatHeader({ onMenuClick, onProfileClick }: ChatHeaderProps) {
  return (
    <header className='flex items-center justify-between px-6 pt-14 pb-4 z-10'>
      <Button
        variant='ghost'
        size='icon'
        onClick={onMenuClick}
        className='p-2 rounded-lg hover:bg-white/20 transition-colors text-purple-600'
      >
        <Menu className='w-6 h-6' />
      </Button>

      <h1 className='text-purple-700 text-lg font-semibold drop-shadow-sm'>
        Emory Agent
      </h1>

      <Button
        variant='ghost'
        size='icon'
        onClick={onProfileClick}
        className='p-2 rounded-full hover:bg-white/20 transition-colors bg-white/10'
      >
        <User className='w-6 h-6 text-gray-600' />
      </Button>
    </header>
  );
}
//채팅 상단 헤더 컴포넌트 (앱 이름, 메뉴 버튼, 프로필 버튼)
