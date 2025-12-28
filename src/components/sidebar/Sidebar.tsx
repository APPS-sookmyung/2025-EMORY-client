'use client';

import { useLocation } from 'wouter';
import { User, Smile, ClipboardList, Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from './SidebarContext';

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const [, navigate] = useLocation();

  // 임시 더미 사용자 데이터 (나중에 실제 사용자 컨텍스트로 교체)
  const user = {
    name: 'Jeewon',
    email: 'emory@gmail.com',
  };

  const go = (path: string) => {
    // 먼저 닫기 애니메이션
    close();
    // 애니메이션 지속시간(300ms)에 맞춰 살짝 지연 후 이동
    setTimeout(() => navigate(path), 300);
  };

  return (
    <>
      {/* dim overlay */}
      <div
        className={`absolute inset-0 z-40 transition ${
          isOpen ? 'bg-black/20 visible' : 'invisible bg-transparent'
        }`}
        style={{ borderRadius: 20 }}
        onClick={close}
      />

      {/* panel attached to phone left edge */}
      <aside
        className={`absolute top-0 z-50 h-full w-[260px] rounded-r-2xl shadow-2xl backdrop-blur-md
        bg-[rgba(191,158,158,0.92)] text-white transition-all duration-300 ${
          isOpen ? 'left-0' : '-left-[260px]'
        }`}
      >
        <div className='px-6 pt-8 pb-3 border-b border-white/30 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>메뉴</h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={close}
            className='text-white/90'
          >
            <X className='w-6 h-6' />
          </Button>
        </div>

        {/* 프로필 */}
        <div
          className='px-6 py-4 flex items-start space-x-3 cursor-pointer select-none'
          onClick={() => go('/my-page')}
        >
          <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'>
            <User className='w-6 h-6 text-white' />
          </div>
          <div className='overflow-hidden flex-1'>
            <div className='text-lg font-semibold leading-tight truncate'>
              {user?.name || 'User'}
            </div>
            <div className='text-white/80 text-xs truncate'>
              {user?.email || 'user@example.com'}
            </div>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <nav className='px-6 space-y-5 mt-5'>
          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95 w-full'
              onClick={() => go('/voice-chat')}
            >
              <Smile className='w-5 h-5 flex-shrink-0' />
              <span className='text-base'>음성 채팅</span>
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95 w-full'
              onClick={() => go('/month-week-report')}
            >
              <ClipboardList className='w-5 h-5 flex-shrink-0' />
              <span className='text-base'>감정 리포트</span>
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95 w-full'
              onClick={() => go('/calendar')}
            >
              <Calendar className='w-5 h-5 flex-shrink-0' />
              <span className='text-base'>캘린더</span>
            </button>
          </div>

          {/* 마이페이지 바로가기 */}
          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95 w-full'
              onClick={() => go('/my-page')}
            >
              <User className='w-5 h-5 flex-shrink-0' />
              <span className='text-base'>마이페이지</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
