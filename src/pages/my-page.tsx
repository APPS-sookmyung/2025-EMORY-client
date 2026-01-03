'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ChevronRight, User } from 'lucide-react';
import Hamburger from '../components/common/Hamburger';
import { Button } from '../components/ui/button';
import SettingsModal from '../components/mypage/SettingsModal';
import { userService, type UserProfileResponse } from '../services/userService';
import { useToast } from '../hooks/use-toast';

export default function MyPage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 사용자 프로필 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await userService.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast({
          title: "프로필 로드 실패",
          description: "사용자 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  const openSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const handleLogout = () => {
    navigate('/logout-confirm-page');
  };

  // 닉네임 표시 (없으면 이메일 앞부분 사용)
  const displayName = profile?.nickname || profile?.email?.split('@')[0] || 'User';

  return (
    <div className='gradient-mypage flex flex-col relative'>
      {/* 상단 뒤로가기 + 햄버거 */}
      <div className='p-4 flex items-center justify-between'>
        <button type='button' aria-label='back' onClick={() => navigate('/')}>
          <ArrowLeft className='w-6 h-6 text-gray-400' />
        </button>
        <Hamburger />
      </div>

      <div className='flex flex-col items-center px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16'>
        {/* 프로필 섹션 */}
        <div className='flex flex-col items-center mb-6 sm:mb-8'>
          <div className='w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg border border-white/30'>
            <User className='w-10 h-10 sm:w-12 sm:h-12 text-gray-400' />
          </div>
          <h1 className='text-xl sm:text-2xl font-medium text-gray-400 mb-1 drop-shadow-sm'>
            {loading ? '로딩 중...' : displayName}
          </h1>
          <p className='text-gray-400 text-sm mb-4 sm:mb-6 drop-shadow-sm'>
            {loading ? '' : profile?.email || ''}
          </p>
          <Button
            variant='secondary'
            className='bg-white/30 hover:bg-white/40 text-gray-400 px-8 py-2 rounded-full backdrop-blur-sm border border-white/40 shadow-lg'
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* 메뉴 항목들 */}
        <div className='w-full max-w-md space-y-3 mt-6 sm:mt-8 pb-10'>
          <button
            onClick={() => navigate('/diary-library')}
            className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'
          >
            <span className='text-gray-400 font-medium'>
              감정 일기 히스토리
            </span>
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
          <button className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
            <span className='text-gray-400 font-medium'>요금제</span>
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
          <button
            onClick={() => navigate('/time-capsule')}
            className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'
          >
            <span className='text-gray-400 font-medium'>타임캡슐</span>
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
          <button
            onClick={openSettingsModal}
            className='w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'
          >
            <span className='text-gray-400 font-medium'>설정</span>
            <ChevronRight className='w-5 h-5 text-orange-300' />
          </button>
        </div>
      </div>

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={closeSettingsModal}
          profile={profile}
        />
      )}
    </div>
  );
}
