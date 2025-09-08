'use client';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useSidebar } from '../components/sidebar/SidebarContext';
import { TrendingUp, Calendar, BarChart3, Sparkles, Cloud, Brain, AlertTriangle, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { EmotionIcon } from '../types/emotion';

// 데이터 타입 정의
interface CategoryData {
  name: string;
  days: number;
  color: string;
  percentage: number;
  icon: EmotionIcon;
}

interface ReportData {
  period: string;
  categories: CategoryData[];
  totalDays: number;
}

// 더미 데이터 생성 함수
const createDummyReportData = (): {
  weekly: ReportData;
  monthly: ReportData;
} => {
  const weeklyData: ReportData = {
    period: '7월 첫째 주',
    totalDays: 7,
    categories: [
      {
        name: '기쁨',
        days: 4,
        color: 'bg-orange-300',
        percentage: 57,
        icon: 'sparkles' as EmotionIcon,
      },
      {
        name: '평온',
        days: 2,
        color: 'bg-blue-300',
        percentage: 29,
        icon: 'cloud' as EmotionIcon,
      },
      {
        name: '사려깊음',
        days: 1,
        color: 'bg-purple-300',
        percentage: 14,
        icon: 'brain' as EmotionIcon,
      },
    ],
  };

  const monthlyData: ReportData = {
    period: '7월',
    totalDays: 31,
    categories: [
      {
        name: '기쁨',
        days: 18,
        color: 'bg-orange-300',
        percentage: 58,
        icon: 'sparkles' as EmotionIcon,
      },
      {
        name: '평온',
        days: 8,
        color: 'bg-blue-300',
        percentage: 26,
        icon: 'cloud' as EmotionIcon,
      },
      {
        name: '사려깊음',
        days: 3,
        color: 'bg-purple-300',
        percentage: 10,
        icon: 'brain' as EmotionIcon,
      },
      {
        name: '불안',
        days: 2,
        color: 'bg-yellow-300',
        percentage: 6,
        icon: 'alert-triangle' as EmotionIcon,
      },
    ],
  };

  return { weekly: weeklyData, monthly: monthlyData };
};

// 원형 차트 컴포넌트
const CircularChart = ({ data }: { data: CategoryData[] }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='relative'>
      <svg width={size} height={size} className='transform -rotate-90'>
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='#d1d5db'
          strokeWidth={strokeWidth}
          fill='none'
        />
        {/* 데이터 원들 */}
        {data.map((category, index) => {
          const strokeDasharray = circumference;
          const targetOffset = circumference - (category.percentage / 100) * circumference;
          const strokeDashoffset = isAnimated ? targetOffset : circumference;
          const colorMap: { [key: string]: string } = {
            'bg-orange-300': '#fdba74',
            'bg-blue-300': '#93c5fd',
            'bg-purple-300': '#c4b5fd',
            'bg-yellow-300': '#fde047',
            'bg-green-300': '#86efac',
          };

          return (
            <circle
              key={category.name}
              cx={size / 2}
              cy={size / 2}
              r={radius - index * (strokeWidth + 4)}
              stroke={colorMap[category.color]}
              strokeWidth={strokeWidth - 2}
              fill='none'
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
              style={{
                transition: `stroke-dashoffset 1.5s ease-in-out ${index * 0.3}s`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// 진행률 바 컴포넌트
const ProgressBar = ({ category }: { category: CategoryData }) => {
  const colorMap: { [key: string]: string } = {
    'bg-orange-300': 'bg-orange-300',
    'bg-blue-300': 'bg-blue-300',
    'bg-purple-300': 'bg-purple-300',
    'bg-yellow-300': 'bg-yellow-300',
    'bg-green-300': 'bg-green-300',
  };

  return (
    <div className='flex items-center space-x-3'>
      <div className='flex items-center justify-center w-5 h-5'>
        {(() => {
          const IconComponent: Record<EmotionIcon, typeof Sparkles> = {
            sparkles: Sparkles,
            cloud: Cloud,
            brain: Brain,
            'alert-triangle': AlertTriangle,
            sun: Sparkles,
            flame: Sparkles,
            droplets: Sparkles,
            zap: Sparkles,
          };
          const SelectedIcon = IconComponent[category.icon];
          return <SelectedIcon className='w-3 h-3 text-[#364153]' />;
        })()}
      </div>
      <div className='flex-1'>
        <div className='flex justify-between text-sm mb-1'>
          <span className='text-[#364153]'>{category.name}</span>
          <span className='text-[#364153]/70'>{category.days}일</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className={`${colorMap[category.color]} h-2 rounded-full relative`}
            style={{ width: `${category.percentage}%` }}
          >
            <div
              className={`absolute right-0 top-0 w-2 h-2 ${colorMap[category.color]} rounded-full transform translate-x-1/2`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 리포트 카드 컴포넌트
const ReportCard = ({ title, data }: { title: string; data: ReportData }) => {
  const [isTextAnimated, setIsTextAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextAnimated(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-3 mb-4'>
        <div className='w-1 h-6 bg-orange-500 rounded'></div>
        <h2 className='text-[#364153] text-xl font-bold tracking-wide' style={{ fontFamily: 'Quicksand, sans-serif' }}>
          {title === '주별 분석' ? 'Weekly Analysis' : 'Monthly Insights'}
        </h2>
        <span className='text-lg font-semibold text-[#364153] tracking-wide' style={{ fontFamily: 'Cute Font, cursive' }}>
          {title === '주별 분석' ? 'July Week 1' : 'July 2025'}
        </span>
      </div>

      <Card className='bg-white/40 backdrop-blur-sm border-white/60 p-6 shadow-lg'>
        <div className='space-y-4'>

          {/* 차트와 범례 */}
          <div className='flex items-center justify-center space-x-8'>
            <CircularChart data={data.categories} />

            <div className='flex-1 space-y-4'>
              {data.categories.map((category, index) => {
                const IconComponent: Record<EmotionIcon, typeof Sparkles> = {
                  sparkles: Sparkles,
                  cloud: Cloud,
                  brain: Brain,
                  'alert-triangle': AlertTriangle,
                  sun: Sparkles,
                  flame: Sparkles,
                  droplets: Sparkles,
                  zap: Sparkles,
                };
                const SelectedIcon = IconComponent[category.icon];

                return (
                  <div
                    key={category.name}
                    className={`flex items-center space-x-4 transition-all duration-700 ease-in-out ${
                      isTextAnimated 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-4'
                    }`}
                    style={{
                      transitionDelay: `${index * 200 + 800}ms`
                    }}
                  >
                    <div className='flex items-center justify-center w-8 h-8'>
                      <SelectedIcon className={`w-5 h-5 text-[#364153]`} />
                    </div>
                    <span className='text-[#364153] text-lg font-medium'>{category.name}</span>
                    <span className='text-[#364153]/70 text-base'>
                      {category.days}일
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 진행률 바들 */}
          <div className='space-y-4 pt-4'>
            {data.categories.map((category) => (
              <ProgressBar key={category.name} category={category} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function MonthWeekReport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { open } = useSidebar();
  const [reportData, setReportData] = useState<{
    weekly: ReportData;
    monthly: ReportData;
  } | null>(null);
  useEffect(() => {
    // 즉시 더미 데이터 로드
    const data = createDummyReportData();
    setReportData(data);
  }, []);



  if (!reportData) {
    return (
      <div className='gradient-mypage flex items-center justify-center'>
        <div className='text-[#364153] text-lg'>데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className='gradient-mypage flex flex-col h-full'>
      {/* 헤더 */}
      <div className='flex items-center justify-between p-4 flex-shrink-0'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => open()}
          className='text-[#364153] hover:bg-white/30'
        >
          <Menu className='w-6 h-6' />
        </Button>
        <h1 className='text-[#364153] text-xl font-bold' style={{ fontFamily: 'Comfortaa, cursive' }}>Data Report</h1>
        <div className='w-6'></div>
      </div>

      {/* 메인 콘텐츠 - 스크롤 가능 */}
      <div className='flex-1 overflow-y-auto px-4 pb-8 space-y-4 custom-scrollbar'>
        {/* 주별 분석 */}
        <ReportCard title='주별 분석' data={reportData.weekly} />

        {/* 월별 인사이트 */}
        <ReportCard title='월별 인사이트' data={reportData.monthly} />
      </div>
    </div>
  );
}