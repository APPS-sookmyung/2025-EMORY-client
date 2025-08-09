'use client';

import { useLocation } from 'wouter';
import { User, Smile, ClipboardList, Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from './SidebarContext';

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const [, navigate] = useLocation();

  const go = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <>
      {/* overlay sized to phone canvas (480x844) */}
      <div
        className={`absolute z-40 transition ${
          isOpen ? 'bg-black/40 visible' : 'invisible bg-black/0'
        }`}
        style={{
          left: 'calc(50% - 240px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 480,
          height: 844,
          borderRadius: 20,
        }}
        onClick={close}
      />

      {/* panel attached to phone left edge */}
      <aside
        className={`absolute top-1/2 -translate-y-1/2 z-50 h-[844px] w-[340px] rounded-r-2xl shadow-2xl backdrop-blur-md
        bg-[rgba(191,158,158,0.95)] text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 340, left: 'calc(50% - 240px)' }}
      >
        <div className='px-7 pt-10 pb-4 border-b border-white/40 flex items-center justify-between'>
          <h2 className='text-3xl font-semibold'>메뉴</h2>
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
        <div className='px-7 py-6 flex items-start space-x-4'>
          <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
            <User className='w-7 h-7 text-white' />
          </div>
          <div>
            <div className='text-2xl font-semibold leading-tight'>Jeewon</div>
            <div className='text-white/80 text-sm'>emory@gmail.com</div>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <nav className='px-7 space-y-6 mt-6'>
          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/voice-chat')}
            >
              <Smile className='w-6 h-6' />
              <span className='text-xl'>감정 일기</span>
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/my-page')}
            >
              <ClipboardList className='w-6 h-6' />
              <span className='text-xl'>리포트</span>
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='flex items-center space-x-3 text-white/95'
              onClick={() => go('/start-page')}
            >
              <Calendar className='w-6 h-6' />
              <span className='text-xl'>캘린더</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
