
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, User } from 'lucide-react'; // User 아이콘 추가
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

import { useLocation } from 'wouter';
import { useToast } from "../hooks/use-toast";
import Hamburger from "../components/common/Hamburger"


// import angryEmoji from "../assets/img/angry-emoji.png";
// import anxiousEmoji from "../assets/img/anxiety-emoji.png";
// import calmEmoji from "../assets/img/expressionless-emoji.png";
// import happyEmoji from "../assets/img/happiness-emoji.png";
// import joyEmoji from "../assets/img/joy-emoji.png";
// import sadEmoji from "../assets/img/sadness-emoji.png";



type MoodEmoji = string


// 일기 데이터 타입 정의
type DiaryEntry = {
  title: string;
  content: string;
  image?: string;
};

// 일정 데이터 타입 정의
type Schedule = {
  id: string;
  title: string;
  time: string;
  description?: string;
};



// 날짜별 기분 데이터 (예시)
const moodData: Record<number, { emoji: MoodEmoji; isScraped: boolean }> = {

  1: { emoji: "😡", isScraped: true },
  3: { emoji: "😡", isScraped: false },
  6: { emoji: "😡", isScraped: false },
  9: { emoji: "😊", isScraped: true },
  10: { emoji: "😊", isScraped: true },
  12: { emoji: "🤔", isScraped: false },
  14: { emoji: "😍", isScraped: false },
  16: { emoji: "😊", isScraped: true },
  17: { emoji: "😊", isScraped: true },
  18: { emoji: "😊", isScraped: true },
  19: { emoji: "😊", isScraped: true },
  20: { emoji: "😴", isScraped: false },
  22: { emoji: "🤔", isScraped: false },
  23: { emoji: "😊", isScraped: true },
}


// 날짜별 일기 데이터 (예시)
const diaryData: Record<number, DiaryEntry> = {
  1: {

    title: "새해 첫날",
    content: "새해가 밝았다. 올해는 더 열심히 살아보자고 다짐했다. 가족들과 함께 떡국을 먹으며 새해 인사를 나누었다.",
    image: "/",
  },
  6: {
    title: "힘든 하루",

    content:
      '오늘은 정말 힘든 하루였다. 일이 잘 풀리지 않아서 스트레스를 많이 받았다. 내일은 더 좋은 날이 되길 바란다.',
  },
  10: {
    title: '태현의 생일파티',
    content:

      "오늘은 태현의 생일이라 생일파티에 다녀왔다. 태현은 나의 가장 친한 친구다. 오랜만에 친구들과 만나서 즐거운 시간을 보냈다. 케이크도 맛있었고 선물도 마음에 들어했다. 다음에는 더 자주 만나기로 했다. 좋은 하루였다.",
    image: "/",
  },
  14: {
    title: "발렌타인데이",
    content: "발렌타인데이라서 특별한 사람과 함께 시간을 보냈다. 달콤한 초콜릿과 함께 행복한 하루였다.",
    image: "/",

  },
  18: {
    title: '봄나들이',
    content:

      "날씨가 좋아서 공원에 나들이를 갔다. 벚꽃이 만개해서 정말 아름다웠다. 사진도 많이 찍고 좋은 추억을 만들었다.",
    image: "/",

  },
};

// 날짜별 일정 데이터 (예시 - Google 캘린더에서 가져온 일정들)
const initialScheduleData: Record<number, Schedule[]> = {
  21: [
    {
      id: 'g1',
      title: '프로젝트 미팅',
      time: '09:00',
      description: '분기별 프로젝트 리뷰',
    },
    { id: 'g2', title: '점심 약속', time: '12:30', description: '동료와 점심' },
    {
      id: 'g3',
      title: '보고서 작성',
      time: '14:00',
      description: '월간 보고서 마무리',
    },
    {
      id: 'g4',
      title: '온라인 강의',
      time: '16:00',
      description: '새로운 기술 학습',
    },
  ],
  22: [
    { id: 'g5', title: '운동', time: '18:00', description: '헬스장 운동' },
    {
      id: 'g6',
      title: '친구와 저녁',
      time: '19:30',
      description: '오랜만에 친구와 식사',
    },
    {
      id: 'g7',
      title: '영화 관람',
      time: '21:00',
      description: '새로 나온 영화 보기',
    },
  ],
  23: [
    {
      id: 'g8',
      title: '가족 저녁',
      time: '19:00',
      description: '가족과 저녁 식사',
    },
    {
      id: 'g9',
      title: '독서 시간',
      time: '21:00',
      description: '자기계발 서적 읽기',
    },
    {
      id: 'g10',
      title: '내일 계획',
      time: '22:00',
      description: '내일 할 일 정리',
    },
  ],
  24: [
    { id: 'g11', title: '팀 회의', time: '10:00', description: '월간 팀 미팅' },
    { id: 'g12', title: '약속', time: '12:00', description: '친구와 점심' },
    {
      id: 'g13',
      title: '개인 프로젝트',
      time: '14:00',
      description: '사이드 프로젝트 진행',
    },
    {
      id: 'g14',
      title: '장보기',
      time: '17:00',
      description: '저녁 식재료 구매',
    },
    {
      id: 'g15',
      title: '요가 수업',
      time: '19:00',
      description: '온라인 요가 클래스',
    },
    {
      id: 'g16',
      title: '드라마 시청',
      time: '21:00',
      description: '최신 드라마 보기',
    },
  ],
  25: [
    { id: 'g17', title: '병원 예약', time: '14:00', description: '정기 검진' },
    { id: 'g18', title: '쇼핑', time: '16:00', description: '생필품 구매' },
    {
      id: 'g19',
      title: '카페에서 작업',
      time: '10:00',
      description: '집중해서 작업하기',
    },
    {
      id: 'g20',
      title: '친구 생일 파티',
      time: '19:00',
      description: '친구 생일 축하',
    },
  ],
  26: [
    {
      id: 'g21',
      title: '독서 모임',
      time: '15:00',
      description: '월간 독서 모임',
    },
    {
      id: 'g22',
      title: '집안일',
      time: '10:00',
      description: '대청소 및 빨래',
    },
    { id: 'g23', title: '산책', time: '17:00', description: '공원 산책' },
  ],
};

export default function MoodCalendar() {

  const [, navigate] = useLocation()
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4)) // May 2024
  const [showScrapedOnly, setShowScrapedOnly] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]) // 여러 개 선택 가능하도록 배열로 변경

  const [newSchedule, setNewSchedule] = useState({
    title: '',
    time: '', // HH:MM 형식으로 저장
    description: '',
  });
  const [scheduleDataState, setScheduleDataState] =
    useState<Record<number, Schedule[]>>(initialScheduleData); // 일정 데이터를 상태로 관리

  const { toast } = useToast() // useToast 훅 사용


  // 오늘 날짜 (예시로 23일로 설정)
  const today = 23;

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // 현재 월의 첫 번째 날과 마지막 날 계산
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 월의 마지막 며칠
  const prevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    0
  );
  const daysInPrevMonth = prevMonth.getDate();

  // 캘린더 날짜 배열 생성
  const calendarDays = [];

  // 이전 월의 날짜들
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }

  // 현재 월의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }

  // 다음 월의 날짜들 (6주 완성을 위해)
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null); // 월 변경 시 선택 초기화
    setSelectedScheduleIds([]); // 월 변경 시 선택된 일정 초기화
  };

  const shouldShowEmoji = (day: number) => {
    // 오늘 이후의 날짜는 이모지 표시 안함
    if (day > today) return false;

    const dayData = moodData[day];
    if (!dayData) return false;

    // 스크랩 모드가 켜져있으면 스크랩된 것만 표시
    if (showScrapedOnly) {
      return dayData.isScraped;
    }

    // 스크랩 모드가 꺼져있으면 모든 이모지 표시
    return true;
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    setSelectedScheduleIds([]); // 날짜 변경 시 선택된 일정 초기화
  };

  const handleAddSchedule = () => {
    if (!selectedDate) {
      toast({
        title: '오류',
        description: '일정을 추가할 날짜를 먼저 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }
    if (!newSchedule.title || !newSchedule.time) {
      toast({
        title: '오류',
        description: '제목과 시간을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const newId = `user-${Date.now()}`; // 사용자 추가 일정 ID
    const addedSchedule: Schedule = {
      id: newId,
      title: newSchedule.title,
      time: newSchedule.time,
      description: newSchedule.description,
    };

    setScheduleDataState((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), addedSchedule].sort(
        (a, b) => a.time.localeCompare(b.time)
      ), // 시간 순으로 정렬
    }));

    toast({
      title: '일정 추가 완료',
      description: `${newSchedule.title} 일정이 추가되었습니다.`,
    });

    setShowAddScheduleModal(false);
    setNewSchedule({ title: '', time: '', description: '' });
  };

  const handleScheduleSelect = (scheduleId: string) => {
    setSelectedScheduleIds((prevSelected) => {
      if (prevSelected.includes(scheduleId)) {
        // 이미 선택된 경우, 제거
        return prevSelected.filter((id) => id !== scheduleId);
      } else {
        // 선택되지 않은 경우, 추가
        return [...prevSelected, scheduleId];
      }
    });
  };


  const selectedDiary =
    selectedDate && selectedDate <= today ? diaryData[selectedDate] : null;
  const selectedDateSchedules = selectedDate
    ? scheduleDataState[selectedDate] || []
    : []; // scheduleDataState 사용
  const showScheduleSelection = selectedDate && !selectedDiary;

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 ">
      {" "}
      
<div className="gradient-calendar flex flex-col relative ">
        {" "}
        {/* Header */}
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <Hamburger className="stroke-green-700" />

          <h1 className="text-xl font-semibold text-green-700">Calendar</h1>

          {/* 마이페이지 아이콘 */}
          <Button variant="ghost" size="icon" className="text-gray-700" onClick={() => navigate('/my-page')}>
            <User className="h-6 w-6" />
          </Button>
        </div>
        
        {/* 스크롤 영역*/}
        <div className="flex-grow overflow-y-auto custom-scrollbar px-4 pb-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full relative">
            {/* Switch (캘린더 박스 우측 상단) */}
            <div className="absolute top-1 right-4 z-10">
              <Switch
                checked={showScrapedOnly}
                onCheckedChange={setShowScrapedOnly}
                className='data-[state=checked]:bg-green-600'
              />
            </div>

            {/* Month Navigation */}
            <div className='flex items-center justify-between mb-6'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => navigateMonth('prev')}
                className='h-8 w-8'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <h2 className='text-lg font-medium text-gray-800'>
                {monthNames[currentDate.getMonth()]}
              </h2>

              <Button
                variant='ghost'
                size='icon'
                onClick={() => navigateMonth('next')}
                className='h-8 w-8'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>

            {/* Days of Week Header */}
            <div className='grid grid-cols-7 gap-1 mb-2'>
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}

            <div className="grid grid-cols-7 gap-1 mb-6">

              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.isCurrentMonth;
                const isToday = isCurrentMonth && date.day === today;
                const isSelected = isCurrentMonth && date.day === selectedDate;
                const shouldShowEmojiForDay = isCurrentMonth && shouldShowEmoji(date.day);
                const dayMoodData = isCurrentMonth ? moodData[date.day] : null;
                
                return (
                  <div
                    key={index}
                    onClick={() => isCurrentMonth && handleDateClick(date.day)}
                                         className={`
                       relative flex flex-col items-center justify-start text-sm rounded-lg p-1 h-12 cursor-pointer
                       ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                       ${isToday ? "border-2 border-green-500" : ""}
                       ${isSelected ? "bg-green-200" : ""}
                     `}
                  >
                    <span className="text-xs font-medium pt-1">{date.day}</span>

                    {/* 기분 이모지 - 날짜 숫자 아래에 배치 */}
                    {shouldShowEmojiForDay && dayMoodData && (
                      <div className="mt-0.5">
                        <span
                          className={`text-xs ${dayMoodData.isScraped ? "opacity-100" : "opacity-70"}`}

                        >
                          {dayMoodData.emoji}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 선택된 날짜의 일기 내용 */}
            {selectedDate && selectedDiary && (
              <div className='space-y-4'>
                <div className='text-lg font-semibold text-gray-800'>
                  {currentDate.getMonth() + 1}/{selectedDate}
                </div>

                <div className='bg-green-100 rounded-lg p-4 border-l-4 border-green-400'>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    {selectedDiary.title}
                  </h3>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    {selectedDiary.content}
                  </p>
                </div>

                {/* 대표 이미지 */}
                {selectedDiary.image && (
                  <div className='mt-4'>
                    <img
                      src={selectedDiary.image || '/placeholder.svg'}
                      alt={selectedDiary.title}
                      className='w-full h-48 object-cover rounded-lg shadow-sm'
                    />
                  </div>
                )}
              </div>
            )}

            {/* 일정 선택 화면 (일기가 없는 날짜에만 표시) */}
            {showScheduleSelection && (
              <div className='space-y-4'>
                <div className='text-center text-gray-700 font-medium'>
                  일기를 쓸 당신의 하루를 선택하세요
                </div>

                {/* 통합된 일정 목록 (Google 캘린더 + 사용자 추가) */}

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {" "}
                  {selectedDateSchedules.length > 0 ? (
                    selectedDateSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        onClick={() => handleScheduleSelect(schedule.id)}

                        className={`
                           p-3 rounded-lg cursor-pointer
                           ${
                             selectedScheduleIds.includes(schedule.id)
                               ? 'bg-green-200 text-green-800'
                               : 'bg-green-100 text-green-700'
                           }
                         `}
                      >
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className='font-medium'>{schedule.title}</div>
                            <div className='text-sm opacity-90'>
                              {currentDate.getMonth() + 1}월 {selectedDate}일
                            </div>
                          </div>
                          <div className='text-sm font-medium'>
                            {schedule.time}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center text-gray-500 py-4'>
                      <div className='text-sm'>이 날짜에는 일정이 없습니다</div>
                    </div>
                  )}
                  {/* 새 일정 추가 버튼  */}
                  <div
                    onClick={() => setShowAddScheduleModal(true)}
                    className="p-4 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition-colors flex items-center justify-center border border-green-200"
                  >
                    <Plus className="h-6 w-6 text-green-600" />

                  </div>
                </div>

                {/* Let's talk to Emory Agent 버튼을 일정 선택 화면 안으로 이동 */}

                <div className="pt-4">
                  <Button onClick={() => navigate('/voice-chat')} className="w-full bg-gray-600 hover:bg-gray-700 text-white">

                    {"Let's talk to Emory Agent"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 일정 추가 모달 */}
      {showAddScheduleModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">새 일정 추가</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddScheduleModal(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <Input
                  placeholder="일정 제목을 입력하세요"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                />
              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                <input
                  type="time"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}

                />
              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">설명 (선택사항)</label>
                <Textarea
                  placeholder="일정에 대한 설명을 입력하세요"
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}

                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleAddSchedule} className="flex-1 bg-green-200 hover:bg-green-300 text-green-800">
                  추가
                </Button>
                <Button variant="outline" onClick={() => setShowAddScheduleModal(false)} className="flex-1">

                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
