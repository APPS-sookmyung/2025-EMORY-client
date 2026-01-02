'use client';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Download, TrendingUp, Heart } from 'lucide-react';
import LoadingScreen from '../components/common/LoadingScreen';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import type { EmotionData, EmotionReport, EmotionIcon as EmotionIconType, EmotionCategory } from '../types/emotion';
import { reportService } from '../services/reportService';

// 감정 카테고리 매핑
const emotionCategoryMap: Record<string, { name: string; icon: EmotionIconType; description: string; color: string; id: EmotionCategory }> = {
  'HAPPY': { id: 'joy' as EmotionCategory, name: '기쁨', icon: 'sun' as EmotionIconType, description: '밝고 긍정적인 순간들', color: 'bg-orange-500' },
  'SOSO': { id: 'calm' as EmotionCategory, name: '평온', icon: 'cloud' as EmotionIconType, description: '평화롭고 차분한 상태', color: 'bg-blue-400' },
  'SAD': { id: 'sadness' as EmotionCategory, name: '슬픔', icon: 'droplets' as EmotionIconType, description: '우울하고 슬픈 감정', color: 'bg-indigo-500' },
  'ANGRY': { id: 'anger' as EmotionCategory, name: '분노', icon: 'flame' as EmotionIconType, description: '강한 감정적 반응', color: 'bg-red-500' },
  'ANXIOUS': { id: 'anxiety' as EmotionCategory, name: '불안', icon: 'alert-triangle' as EmotionIconType, description: '걱정과 긴장감', color: 'bg-yellow-500' },
  'THOUGHTFUL': { id: 'thoughtful' as EmotionCategory, name: '사려깊음', icon: 'brain' as EmotionIconType, description: '깊은 성찰과 분석', color: 'bg-purple-500' },
};

// 감정 아이콘 컴포넌트 (타입 안전 버전)
const EmotionIconComponent = ({
  iconName,
  className = 'w-5 h-5',
}: {
  iconName: EmotionIconType;
  className?: string;
}) => {
  const iconMap: Record<EmotionIconType, React.ReactNode> = {
    sun: <div className={`${className} bg-yellow-400 rounded-full`} />,
    cloud: <div className={`${className} bg-blue-300 rounded-full`} />,
    brain: <div className={`${className} bg-purple-400 rounded-full`} />,
    flame: <div className={`${className} bg-red-400 rounded-full`} />,
    'alert-triangle': (
      <div className={`${className} bg-yellow-400 rounded-full`} />
    ),
    droplets: <div className={`${className} bg-blue-400 rounded-full`} />,
    zap: <div className={`${className} bg-yellow-300 rounded-full`} />,
    sparkles: <div className={`${className} bg-orange-300 rounded-full`} />,
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

  // 감정 리포트 데이터 로드 - 월간 리포트 데이터 사용
  useEffect(() => {
    const loadEmotionReport = async () => {
      try {
        setIsLoading(true);

        // 현재 월의 리포트 데이터 가져오기
        const currentYearMonth = new Date().toISOString().substring(0, 7);
        const monthlyReport = await reportService.getMonthlyReport(currentYearMonth);

        // 백엔드 응답을 EmotionReport 형식으로 변환
        const emotions: EmotionData[] = monthlyReport.data.emotionStatistics.map(stat => {
          const mapping = emotionCategoryMap[stat.emotionCategory] || {
            id: 'joy' as EmotionCategory,
            name: stat.emotionCategory,
            icon: 'sparkles' as EmotionIconType,
            description: '',
            color: 'bg-gray-500'
          };

          return {
            id: mapping.id,
            name: mapping.name,
            icon: mapping.icon,
            description: mapping.description,
            percentage: Math.round(stat.percentage),
            color: mapping.color,
          };
        });

        const mainEmotion = emotions.length > 0
          ? emotions.reduce((max, current) => current.percentage > max.percentage ? current : max)
          : emotions[0];

        const report: EmotionReport = {
          id: `report_${Date.now()}`,
          userId: 'current_user',
          createdAt: new Date().toISOString(),
          mainEmotion,
          emotionDistribution: emotions,
          feedback: monthlyReport.data.mostFrequentEmotions
            ? `이번 달에는 ${monthlyReport.data.mostFrequentEmotions} 감정이 주를 이루었습니다. 총 ${monthlyReport.data.totalDiaries}개의 일기가 작성되었어요.`
            : '감정 데이터를 분석 중입니다.',
        };

        setEmotionReport(report);
      } catch (error) {
        console.error('감정 리포트 로드 실패:', error);
        toast({
          title: '오류',
          description: error instanceof Error ? error.message : '감정 리포트를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
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
    return <LoadingScreen message="감정 리포트를 분석하고 있습니다" submessage="AI가 대화 내용을 분석중이에요" />;
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
                          <EmotionIconComponent
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
                  <EmotionIconComponent
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

            {/* 하단 버튼들 */}
            <div className='pt-6 pb-8 space-y-3'>
              {/* 일기 작성하기 버튼 */}
              <Button
                onClick={() => {
                  // 감정 리포트 데이터를 일기 작성 페이지로 전달하기 위해 loading 페이지를 거침
                  navigate('/loading?redirect=diary-write');
                }}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-medium shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-blue-500/30'
              >
                <Heart className='w-5 h-5' />
                <span>✏️ 감정 일기 작성하기</span>
              </Button>

              {/* 감정 리포트 저장 버튼 */}
              <Button
                onClick={handleSaveReport}
                variant="outline"
                className='w-full bg-white/10 hover:bg-white/20 text-gray-400 border-gray-400/30 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2'
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
