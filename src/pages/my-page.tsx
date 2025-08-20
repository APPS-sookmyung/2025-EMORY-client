'use client';

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ChevronRight, User } from 'lucide-react';
import Hamburger from '../components/common/Hamburger';
import { Button } from '../components/ui/button';
import SettingsModal from '../components/mypage/SettingsModal';

export default function MyPage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [, navigate] = useLocation();

  const openSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const handleLogout = () => {
    navigate('/logout-confirm-page');
  };

  return (
    // <GradientBackground variant="default"> {/* ✅ 수정됨: 전체 페이지를 GradientBackground로 감쌈 */}
    <div className='gradient-mypage flex flex-col relative'>
      {/* 상단 뒤로가기 + 햄버거 */}
      <div className='p-4 flex items-center justify-between'>
        <button type='button' aria-label='back' onClick={() => navigate('/')}>
          <ArrowLeft className='w-6 h-6 text-gray-400' />
        </button>
        <Hamburger />
      </div>

      <div className='flex flex-col items-center px-6 pt-16'>
        {/* 프로필 섹션 */}
        <div className='flex flex-col items-center mb-8'>
          <div className='w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg border border-white/30'>
            <User className='w-12 h-12 text-gray-400' />{' '}
            {/* ✅ 수정됨: 흰색 아이콘으로 변경 */}
          </div>
          <h1 className='text-2xl font-medium text-gray-400 mb-1 drop-shadow-sm'>
            Jeewon
          </h1>{' '}
          {/* ✅ 수정됨: 흰색 텍스트 */}
          <p className='text-gray-400 text-sm mb-6 drop-shadow-sm'>
            emory@gmail.com
          </p>{' '}
          {/* ✅ 수정됨 */}
          <Button
            variant='secondary'
            className='bg-white/30 hover:bg-white/40 text-gray-400 px-8 py-2 rounded-full backdrop-blur-sm border border-white/40 shadow-lg' // ✅ 수정됨
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* 메뉴 항목들 */}
        <div className='w-full px-6 space-y-3 mt-8 pb-10'>
          {' '}
          {/* ✅ 수정됨: 전체 폭 사용 */}
          <button className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
            <span className='text-gray-400 font-medium'>
              감정 일기 히스토리
            </span>{' '}
            {/* ✅ 수정됨 */}
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
          <button className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
            <span className='text-gray-400 font-medium'>요금제</span>{' '}
            {/* ✅ 수정됨 */}
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
          <button 
            onClick={() => navigate('/time-capsule')}
            className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
            <span className='text-gray-400 font-medium'>타임캡슐</span>{' '}
            {/* ✅ 수정됨 */}
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
          <button
            onClick={openSettingsModal}
            className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'
          >
            <span className='text-gray-400 font-medium'>설정</span>{' '}
            {/* ✅ 수정됨 */}
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
        </div>
      </div>

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={closeSettingsModal}
        />
      )}
    </div>
    // </GradientBackground>
  );
}
