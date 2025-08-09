'use client';

import { ArrowLeft } from 'lucide-react';
import Hamburger from '../components/common/Hamburger';
import { useLocation } from 'wouter';

export default function EmotionReportPage() {
  const [, navigate] = useLocation();
  return (
    <div className='gradient-mypage flex flex-col relative'>
      <div className='p-4 flex items-center justify-between'>
        <button onClick={() => navigate('/')}>
          <ArrowLeft className='w-6 h-6 text-gray-600' />
        </button>
        <Hamburger />
      </div>

      <div className='flex-1 flex items-center justify-center px-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-semibold text-gray-700 mb-2'>
            감정 리포트
          </h1>
          <p className='text-gray-600'>리포트 화면은 곧 준비될 예정입니다.</p>
        </div>
      </div>
    </div>
  );
}
