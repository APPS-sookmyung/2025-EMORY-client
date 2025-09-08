'use client';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Download, TrendingUp, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { EmotionData, EmotionReport, EmotionIcon, EmotionCategory, EMOTION_ICON_MAP } from '../types/emotion';

// 더미 데이터 생성 함수 (나중에 API 호출로 교체)
const createDummyEmotionReport = (): EmotionReport => {
  const emotions: EmotionData[] = [
    {
      id: 'joy' as EmotionCategory,
      name: '기쁨',
      icon: 'sun' as EmotionIcon,
      description: '밝고 긍정적인 순간들',
      percentage: 35,
      color: 'bg-orange-500',
    },
    {
      id: 'calm' as EmotionCategory,
      name: '평온',
      icon: 'cloud' as EmotionIcon,
      description: '평화롭고 차분한 상태',
      percentage: 25,
      color: 'bg-blue-400',
    },
    {
      id: 'thoughtful' as EmotionCategory,
      name: '사려깊음',
      icon: 'brain' as EmotionIcon,
      description: '깊은 성찰과 분석',
      percentage: 20,
      color: 'bg-purple-500',
    },
    {
      id: 'anger' as EmotionCategory,
      name: '분노',
      icon: 'flame' as EmotionIcon,
      description: '강한 감정적 반응',
      percentage: 10,
      color: 'bg-red-500',
    },
    {
      id: 'anxiety' as EmotionCategory,
      name: '불안',
      icon: 'alert-triangle' as EmotionIcon,
      description: '걱정과 긴장감',
      percentage: 5,
      color: 'bg-yellow-500',
    },
    {
      id: 'sadness' as EmotionCategory,
      name: '슬픔',
      icon: 'droplets' as EmotionIcon,
      description: '우울하고 슬픈 감정',
      percentage: 3,
      color: 'bg-indigo-500',
    },
    {
      id: 'excitement' as EmotionCategory,
      name: '신남',
      icon: 'zap' as EmotionIcon,
      description: '흥미진진하고 즐거운 기분',
      percentage: 2,
      color: 'bg-pink-500',
    },
  ];

  // 가장 높은 퍼센티지를 가진 감정을 주요 감정으로 설정
  const mainEmotion = emotions.reduce((max, current) =>
    current.percentage > max.percentage ? current : max
  );

  return {
    id: `report_${Date.now()}`,
    userId: 'user_123',
    createdAt: new Date().toISOString(),
    mainEmotion,
    emotionDistribution: emotions,
    feedback:
      '오늘 대화에서 기쁨과 평온이 주를 이루었습니다. 전반적으로 긍정적인 에너지가 느껴졌어요. 특히 새로운 아이디어에 대한 호기심과 사려깊은 성찰이 돋보였습니다.',
  };
};

// 감정 아이콘 컴포넌트 (타입 안전 버전)
const EmotionIcon = ({
  iconName,
  className = 'w-5 h-5',
}: {
  iconName: EmotionIcon;
  className?: string;
}) => {
  const iconMap: Record<EmotionIcon, React.ReactNode> = {
    sun: <div className={`${className} bg-yellow-400 rounded-full`} />,
    cloud: <div className={`${className} bg-blue-300 rounded-full`} />,
    brain: <div className={`${className} bg-purple-400 rounded-full`} />,
    flame: <div className={`${className} bg-red-400 rounded-full`} />,
    'alert-triangle': (
      <div className={`${className} bg-yellow-400 rounded-full`} />
    ),
    droplets: <div className={`${className} bg-blue-400 rounded-full`} />,
    zap: <div className={`${className} bg-yellow-300 rounded-full`} />,
  };

  return iconMap[iconName];
};

export default function EmotionReportPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [emotionReport, setEmotionReport] = useState<EmotionReport | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // 감정 리포트 데이터 로드 (나중에 API 호출로 교체)
  useEffect(() => {
    const loadEmotionReport = async () => {
      try {
        setIsLoading(true);

        // TODO: 여기에 실제 API 호출 코드를 넣으세요
        // 예시:
        // const reportId = new URLSearchParams(window.location.search).get('reportId')
        // const response = await fetch(`/api/emotion-reports/${reportId}`)
        // const report = await response.json()

        // 현재는 더미 데이터 사용
        const report = createDummyEmotionReport();
        setEmotionReport(report);
      } catch (error) {
        console.error('감정 리포트 로드 실패:', error);
        toast({
          title: '오류',
          description: '감정 리포트를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
        // 에러 시에도 더미 데이터 표시
        setEmotionReport(createDummyEmotionReport());
      } finally {
        setIsLoading(false);
      }
    };

    loadEmotionReport();
  }, [toast]);

  const handleSaveReport = async () => {
    if (!emotionReport) return;

    try {
      // TODO: 여기에 실제 저장 API 호출 코드를 넣으세요
      // 예시:
      // const response = await fetch(`/api/emotion-reports/${emotionReport.id}/save`, {
      //   method: 'POST'
      // })
      // const result = await response.json()

      toast({
        title: '성공',
        description: '감정 리포트가 저장되었습니다.',
      });
    } catch (error) {
      console.error('감정 리포트 저장 실패:', error);
      toast({
        title: '오류',
        description: '감정 리포트 저장에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='gradient-mypage flex flex-col relative h-full'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p className='text-gray-400'>감정 리포트를 분석하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!emotionReport) {
    return (
      <div className='gradient-mypage flex flex-col relative h-full'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-gray-400'>감정 리포트를 불러올 수 없습니다.</p>
            <Button onClick={() => navigate('/voice-chat')} className='mt-4'>
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='gradient-mypage flex flex-col relative h-full'>
      {/* 헤더 */}
      <div className='flex items-center justify-between p-4 flex-shrink-0'>
        <button onClick={() => navigate('/voice-chat')}>
          <ArrowLeft className='w-6 h-6 text-gray-400' />
        </button>
        <h1 className='text-xl font-semibold text-gray-600'>감정 리포트</h1>
        <div className='w-6'></div>
      </div>

      {/* 스크롤 가능한 메인 콘텐츠 */}
      <div className='flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar'>
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
                {emotionReport.emotionDistribution.map((emotion, index) => (
                  <div key={index} className='bg-white/20 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`w-6 h-6 ${emotion.color} rounded-full flex items-center justify-center text-white`}
                        >
                          <EmotionIcon
                            iconName={emotion.icon}
                            className='w-4 h-4'
                          />
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
                          {emotion.percentage}%
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
                  <EmotionIcon
                    iconName={emotionReport.mainEmotion.icon}
                    className='w-8 h-8'
                  />
                </div>
                <h3 className='text-xl font-bold text-gray-400 mb-1'>
                  {emotionReport.mainEmotion.name}
                </h3>
                <div className='flex items-center justify-center space-x-2'>
                  <span className='text-sm text-gray-400'>
                    대화의 {emotionReport.mainEmotion.percentage}%
                  </span>
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
                  {emotionReport.feedback}
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
