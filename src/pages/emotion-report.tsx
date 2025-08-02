'use client';

import { useLocation } from 'wouter';
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Sun,
  Cloud,
  Brain,
  Search,
  Heart,
  Smile,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function EmotionReport() {
  const [, navigate] = useLocation();

  const handleSaveReport = () => {
    // 감정 리포트 저장 로직
    console.log('감정 리포트 저장');
  };

  const emotions = [
    {
      name: '기쁨',
      icon: <Sun className='w-5 h-5' />,
      description: '밝고 긍정적인 순간들',
      percentage: '35%',
      color: 'bg-orange-500',
      progressColor: 'bg-orange-400',
    },
    {
      name: '평온',
      icon: <Cloud className='w-5 h-5' />,
      description: '평화롭고 차분한 상태',
      percentage: '28%',
      color: 'bg-blue-400',
      progressColor: 'bg-blue-300',
    },
    {
      name: '사려깊음',
      icon: <Brain className='w-5 h-5' />,
      description: '깊은 성찰과 분석',
      percentage: '22%',
      color: 'bg-purple-500',
      progressColor: 'bg-purple-400',
    },
    {
      name: '호기심',
      icon: <Search className='w-5 h-5' />,
      description: '배우고 탐구하려는 열망',
      percentage: '15%',
      color: 'bg-green-500',
      progressColor: 'bg-green-400',
    },
  ];

  return (
    <div className='gradient-emotion-report flex flex-col relative h-full'>
      {/* 상단 뒤로가기 버튼 */}
      <div className='p-4 flex-shrink-0'>
        <button onClick={() => navigate('/voice-chat')}>
          <ArrowLeft className='w-6 h-6 text-gray-400' />
        </button>
      </div>

      {/* 스크롤 가능한 메인 콘텐츠 */}
      <div className='flex-1 overflow-y-auto px-6 pb-6'>
        <div className='flex flex-col items-center pt-8'>
          {/* 프로필 섹션 */}
          <div className='flex flex-col items-center mb-8'>
            <div className='w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg border border-white/30'>
              <Heart className='w-12 h-12 text-gray-400' />
            </div>
            <h1 className='text-2xl font-medium text-gray-400 mb-1 drop-shadow-sm'>
              감정 리포트
            </h1>
            <p className='text-gray-400 text-sm mb-6 drop-shadow-sm'>
              오늘의 대화 분석 결과
            </p>
          </div>

          {/* 메뉴 항목들 */}
          <div className='w-full space-y-3 mt-8'>
            {/* 감정 분포 카드 */}
            <Card className='bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
              <div className='text-center mb-4'>
                <h2 className='text-lg font-medium text-gray-400 mb-2'>
                  감정 분포
                </h2>
                <p className='text-xs text-gray-400'>
                  오늘 하루 당신의 감정이 어떻게 균형을 이뤘는지 보여드려요
                </p>
              </div>

              {/* 감정 리스트 */}
              <div className='space-y-2 mb-4'>
                {emotions.map((emotion, index) => (
                  <div key={index} className='bg-white/20 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`w-6 h-6 ${emotion.color} rounded-full flex items-center justify-center text-white`}
                        >
                          {emotion.icon}
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-400'>
                            {emotion.name}
                          </div>
                          <div className='text-xs text-gray-400'>
                            {emotion.description}
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold text-gray-400 text-sm'>
                          {emotion.percentage}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 주요 감정 카드 */}
            <Card className='bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
              <div className='text-center mb-4'>
                <h2 className='text-lg font-medium text-gray-400 mb-2'>
                  주요 감정
                </h2>
                <p className='text-xs text-gray-400'>오늘 하루를 정의한 감정</p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Smile className='w-8 h-8 text-gray-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-400 mb-1'>기쁨</h3>
                <div className='flex items-center justify-center space-x-2'>
                  <span className='text-sm text-gray-400'>대화의 35%</span>
                  <TrendingUp className='w-4 h-4 text-orange-300' />
                </div>
              </div>
            </Card>

            {/* Emory Agent Feedback */}
            <Card className='bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40'>
              <h3 className='font-bold text-gray-400 mb-3 text-center'>
                Emory Agent 의 Feedback
              </h3>
              <div className='bg-white/20 rounded-lg p-3'>
                <p className='text-sm text-gray-400 leading-relaxed text-center'>
                  이 감정이 오늘 대화를 주도했으며, 전반적으로 긍정적인 관점을
                  반영합니다. 밝은 에너지와 희망적인 태도가 돋보였어요.
                </p>
              </div>
            </Card>

            {/* 하단 저장 버튼 */}
            <div className='pt-6 pb-8'>
              <Button
                onClick={handleSaveReport}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-medium shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-purple-500/30'
              >
                <Download className='w-5 h-5' />
                <span>↓ 감정 리포트 저장하기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
