'use client';
import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../components/sidebar/SidebarContext';
import { Sparkles, Cloud, Brain, AlertTriangle, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import type { EmotionIcon } from '../types/emotion';
import { reportService } from '../services/reportService';
import type { WeeklyReportResponse, MonthlyReportResponse, EmotionStatistic } from '../types/reports';

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

// 감정 카테고리 한글 매핑
const emotionNameMap: { [key: string]: string } = {
  'HAPPY': '기쁨',
  'SOSO': '평온',
  'SAD': '슬픔',
  'ANGRY': '화남',
  'ANXIOUS': '불안',
  'THOUGHTFUL': '사려깊음',
};

// 감정 카테고리별 색상 매핑
const emotionColorMap: { [key: string]: string } = {
  'HAPPY': 'bg-orange-300',
  'SOSO': 'bg-blue-300',
  'SAD': 'bg-purple-300',
  'ANGRY': 'bg-red-300',
  'ANXIOUS': 'bg-yellow-300',
  'THOUGHTFUL': 'bg-purple-300',
};

// 감정 카테고리별 아이콘 매핑
const emotionIconMap: { [key: string]: EmotionIcon } = {
  'HAPPY': 'sparkles' as EmotionIcon,
  'SOSO': 'cloud' as EmotionIcon,
  'SAD': 'droplets' as EmotionIcon,
  'ANGRY': 'flame' as EmotionIcon,
  'ANXIOUS': 'alert-triangle' as EmotionIcon,
  'THOUGHTFUL': 'brain' as EmotionIcon,
};

// 백엔드 응답을 CategoryData[]로 변환
const transformEmotionStats = (stats: EmotionStatistic[]): CategoryData[] => {
  return stats.map(stat => ({
    name: emotionNameMap[stat.emotionCategory] || stat.emotionCategory,
    days: stat.count,
    color: emotionColorMap[stat.emotionCategory] || 'bg-gray-300',
    percentage: Math.round(stat.percentage),
    icon: emotionIconMap[stat.emotionCategory] || ('sparkles' as EmotionIcon),
  }));
};

// Weekly 응답 변환
const transformWeeklyData = (response: WeeklyReportResponse): ReportData => {
  const startDate = new Date(response.data.weekStartDate);
  const endDate = new Date(response.data.weekEndDate);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return {
    period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    totalDays: response.data.totalDiaries,
    categories: transformEmotionStats(response.data.emotionStatistics),
  };
};

// Monthly 응답 변환
const transformMonthlyData = (response: MonthlyReportResponse): ReportData => {
  const [year, month] = response.data.yearMonth.split('-');

  return {
    period: `${year}년 ${parseInt(month)}월`,
    totalDays: response.data.totalDiaries,
    categories: transformEmotionStats(response.data.emotionStatistics),
  };
};

// 원형 차트 컴포넌트 (반응형)
const CircularChart = ({
  data,
  maxSize = 240,
  minSize = 120,
}: {
  data: CategoryData[];
  maxSize?: number;
  minSize?: number;
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [size, setSize] = useState(minSize);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const strokeWidth = Math.max(10, Math.round(size / 12));
  const baseRadius = (size - strokeWidth) / 2;

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 컨테이너 너비에 맞춰 차트 크기 조정
  useEffect(() => {
    if (!chartRef.current) return;
    const el = chartRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        const s = Math.max(minSize, Math.min(maxSize, w));
        setSize(s);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxSize, minSize]);

  return (
    <div className='relative w-full' ref={chartRef}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className='transform -rotate-90 block mx-auto'
        role='img'
        aria-label={`원형 차트: 감정 분포를 보여주는 차트입니다. ${data
          .map((cat) => `${cat.name} ${cat.percentage}%`)
          .join(', ')}`}
        preserveAspectRatio='xMidYMid meet'
      >
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={baseRadius}
          stroke='#d1d5db'
          strokeWidth={strokeWidth}
          fill='none'
        />
        {/* 데이터 원들 */}
        {data.map((category, index) => {
          const currentRadius = Math.max(8, baseRadius - index * (strokeWidth + 4));
          const ringCircumference = 2 * Math.PI * currentRadius;
          const strokeDasharray = ringCircumference;
          const targetOffset = ringCircumference - (category.percentage / 100) * ringCircumference;
          const strokeDashoffset = isAnimated ? targetOffset : ringCircumference;
          const colorMap: { [key: string]: string } = {
            'bg-orange-300': '#fdba74',
            'bg-blue-300': '#93c5fd',
            'bg-purple-300': '#c4b5fd',
            'bg-yellow-300': '#fde047',
            'bg-green-300': '#86efac',
            'bg-red-300': '#fca5a5',
          };

          return (
            <circle
              key={category.name}
              cx={size / 2}
              cy={size / 2}
              r={currentRadius}
              stroke={colorMap[category.color]}
              strokeWidth={Math.max(6, strokeWidth - 2)}
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
    'bg-red-300': 'bg-red-300',
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
        <div className='w-full bg-gray-200 rounded-full h-2' role='progressbar' aria-valuenow={category.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${category.name} ${category.percentage}%`}>
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
          {data.period}
        </span>
      </div>

      <Card className='bg-white/40 backdrop-blur-sm border-white/60 p-6 shadow-lg'>
        <div className='space-y-4'>

          {/* 차트와 범례: 모바일 스택 → md+ 2열 */}
          <div className='row'>
            <div className='col-12 col-md-5 flex items-center justify-center mb-3 mb-md-0'>
              <CircularChart data={data.categories} />
            </div>
            <div className='col-12 col-md-7 space-y-4'>
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
  const { toast } = useToast();
  const { open } = useSidebar();
  const [reportData, setReportData] = useState<{
    weekly: ReportData;
    monthly: ReportData;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);

        const currentDate = new Date().toISOString().split('T')[0];
        const currentYearMonth = currentDate.substring(0, 7);

        const [weeklyResponse, monthlyResponse] = await Promise.all([
          reportService.getWeeklyReport(currentDate),
          reportService.getMonthlyReport(currentYearMonth)
        ]);

        setReportData({
          weekly: transformWeeklyData(weeklyResponse),
          monthly: transformMonthlyData(monthlyResponse)
        });
      } catch (error) {
        console.error('Report data loading failed:', error);
        toast({
          title: '리포트 로드 실패',
          description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive',
        });

        // 에러 발생시 빈 데이터로 대체
        setReportData({
          weekly: { period: '이번 주', categories: [], totalDays: 0 },
          monthly: { period: '이번 달', categories: [], totalDays: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [toast]);

  if (loading) {
    return (
      <div className='gradient-mypage flex items-center justify-center'>
        <div className='text-[#364153] text-lg'>데이터를 불러오는 중...</div>
      </div>
    );
  }

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
