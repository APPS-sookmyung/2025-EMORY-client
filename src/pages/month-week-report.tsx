'use client';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

// 데이터 타입 정의
interface CategoryData {
  name: string;
  days: number;
  color: string;
  percentage: number;
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
        name: '운동',
        days: 7,
        color: 'bg-orange-500',
        percentage: 100,
      },
      {
        name: '소비',
        days: 6,
        color: 'bg-blue-400',
        percentage: 85,
      },
      {
        name: '행복',
        days: 3,
        color: 'bg-green-500',
        percentage: 43,
      },
    ],
  };

  const monthlyData: ReportData = {
    period: '7월',
    totalDays: 31,
    categories: [
      {
        name: '운동',
        days: 25,
        color: 'bg-orange-500',
        percentage: 81,
      },
      {
        name: '소비',
        days: 28,
        color: 'bg-blue-400',
        percentage: 90,
      },
      {
        name: '행복',
        days: 22,
        color: 'bg-green-500',
        percentage: 71,
      },
    ],
  };

  return { weekly: weeklyData, monthly: monthlyData };
};

// 원형 차트 컴포넌트
const CircularChart = ({ data }: { data: CategoryData[] }) => {
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className='relative'>
      <svg width={size} height={size} className='transform -rotate-90'>
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='#374151'
          strokeWidth={strokeWidth}
          fill='none'
        />
        {/* 데이터 원들 */}
        {data.map((category, index) => {
          const strokeDasharray = circumference;
          const strokeDashoffset =
            circumference - (category.percentage / 100) * circumference;
          const colorMap: { [key: string]: string } = {
            'bg-orange-500': '#f97316',
            'bg-blue-400': '#60a5fa',
            'bg-green-500': '#22c55e',
          };

          return (
            <circle
              key={category.name}
              cx={size / 2}
              cy={size / 2}
              r={radius - index * (strokeWidth / 2)}
              stroke={colorMap[category.color]}
              strokeWidth={strokeWidth - 2}
              fill='none'
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
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
    'bg-orange-500': 'bg-orange-500',
    'bg-blue-400': 'bg-blue-400',
    'bg-green-500': 'bg-green-500',
  };

  return (
    <div className='flex items-center space-x-3'>
      <div className='w-3 h-3 rounded-full bg-gray-400'></div>
      <div className='flex-1'>
        <div className='flex justify-between text-sm mb-1'>
          <span className='text-white'>{category.name}</span>
          <span className='text-gray-300'>{category.days}일</span>
        </div>
        <div className='w-full bg-gray-700 rounded-full h-2'>
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
  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <div className='w-1 h-6 bg-orange-500 rounded'></div>
        <h2 className='text-white text-lg font-semibold'>{title}</h2>
      </div>

      <Card className='bg-white/10 backdrop-blur-md border-white/20 p-6'>
        <div className='space-y-4'>
          {/* 헤더 */}
          <div className='text-right text-sm text-gray-300'>
            <div>{data.period}</div>
            <div>이번 주의 키워드</div>
            <div>""의 한 달</div>
          </div>

          {/* 차트와 범례 */}
          <div className='flex items-start space-x-6'>
            <CircularChart data={data.categories} />

            <div className='flex-1 space-y-3'>
              {data.categories.map((category) => (
                <div
                  key={category.name}
                  className='flex items-center space-x-2'
                >
                  <div
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></div>
                  <span className='text-white text-sm'>{category.name}</span>
                  <span className='text-gray-300 text-sm'>
                    {category.days}일
                  </span>
                </div>
              ))}
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
  const [reportData, setReportData] = useState<{
    weekly: ReportData;
    monthly: ReportData;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const loadData = async () => {
      try {
        setLoading(true);
        // 실제로는 API 호출
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = createDummyReportData();
        setReportData(data);
      } catch (error) {
        toast({
          title: '오류',
          description: '데이터를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleBack = () => {
    setLocation('/emotion-report');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center'>
        <div className='text-white text-lg'>데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center'>
        <div className='text-white text-lg'>데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      {/* 헤더 */}
      <div className='flex items-center justify-between p-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleBack}
          className='text-white hover:bg-white/10'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          뒤로
        </Button>
        <h1 className='text-white text-xl font-bold'>데이터 리포트</h1>
        <div className='w-10'></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className='px-4 pb-8 space-y-8'>
        {/* 주별 분석 */}
        <ReportCard title='주별 분석' data={reportData.weekly} />

        {/* 월별 인사이트 */}
        <ReportCard title='월별 인사이트' data={reportData.monthly} />
      </div>
    </div>
  );
}
