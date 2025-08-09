'use client';

import { useLocation } from 'wouter';
import { User, Smile, ClipboardList, Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from './SidebarContext';

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const [, navigate] = useLocation();

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
        className={`absolute top-0 left-0 z-50 h-full w-[220px] rounded-r-2xl shadow-2xl backdrop-blur-md
        bg-[rgba(191,158,158,0.92)] text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 220 }}
      >
        <div className='px-5 pt-8 pb-3 border-b border-white/30 flex items-center justify-between'>
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
          className='px-5 py-5 flex items-start space-x-3 cursor-pointer select-none'
          onClick={() => go('/my-page')}
        >
          <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
            <User className='w-6 h-6 text-white' />
          </div>
          <div>
            <div className='text-lg font-semibold leading-tight'>Jeewon</div>
            <div className='text-white/80 text-xs'>emory@gmail.com</div>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <nav className='px-5 space-y-5 mt-5'>
          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/emotion-diary')}
            >
              <Smile className='w-5 h-5' />
              <span className='text-lg'>감정 일기</span>
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/emotion-report')}
            >
              <ClipboardList className='w-5 h-5' />
              <span className='text-lg'>리포트</span>
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/start-page')}
            >
              <Calendar className='w-5 h-5' />
              <span className='text-lg'>캘린더</span>
            </button>
          </div>

          {/* 마이페이지 바로가기 */}
          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/my-page')}
            >
              <User className='w-5 h-5' />
              <span className='text-lg'>마이페이지</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
