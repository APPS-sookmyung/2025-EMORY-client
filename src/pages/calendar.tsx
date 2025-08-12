"use client"

import { useMemo, useState } from "react"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { ChevronRight, ChevronLeft, Menu, Plus, X } from "lucide-react"
import { input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { Toaster } from "../components/ui/toaster"
import { useLocation } from "wouter"; 

import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { ko } from "date-fns/locale"

//이모지 정의
type MoodEmoji = string

//일기 데이터 타입 정의
type DiaryEntry={
    title: string
    content: string
    image?: string
}

//일기 데이터 타입 정의
type Schedule={
    id: string
    title: string
    time: string
    description: string
}

//날짜별 기분 데이터- 이미지 파일 경로
const moodData: Record< number, {emogi: MoodEmoji; isScraped: boolean}>={
    1: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood1.png?height=20&width=20", isScraped: true},
    2: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood2.png?height=20&width=20", isScraped: false},
    3: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood3.png?height=20&width=20", isScraped: false},
    4: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood4.png?height=20&width=20", isScraped: false},
    5: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood5.png?height=20&width=20", isScraped: false},
    6: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood6.png?height=20&width=20", isScraped: false},
    7: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood7.png?height=20&width=20", isScraped: true},
    8: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood8.png?height=20&width=20", isScraped: false},
    9: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood9.png?height=20&width=20", isScraped: false},
    10: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood10.png?height=20&width=20", isScraped: false},
    11: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood11.png?height=20&width=20", isScraped: false},
    12: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood12.png?height=20&width=20", isScraped: true},
    13: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood13.png?height=20&width=20", isScraped: true},
    14: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood14.png?height=20&width=20", isScraped: false},
    15: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood15.png?height=20&width=20", isScraped: false},
    16: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood16.png?height=20&width=20", isScraped: false},
    17: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood17.png?height=20&width=20", isScraped: false},
    18: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood18.png?height=20&width=20", isScraped: false},
    19: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood19.png?height=20&width=20", isScraped: false},
    20: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood20.png?height=20&width=20", isScraped: false},  
    21: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood21.png?height=20&width=20", isScraped: false},
    22: {emogi: "C:\\Users\\ygkgy\\Documents\\김영교\\2025-EMORY-client\\src\\styles\\mood22.png?height=20&width=20", isScraped: false},    
}


//날짜별 일기 데이터(예)-스크랩해둔 것만 표시
const diaryData: Record<number, DiaryEntry>={
    1: {title: "힘든 하루", content: "오늘은 정말 힘든 하루였다. 일이 잘 풀리지 않아서 스트레스를 많이 받았다. 내일은 더 좋은 날이 되길 바란다.", image: "/placeholder.svg?height=200&width=300"},
    7: {title: "태현이 생일파티", content: "오늘은 태현이 생일이라 파티에 다녀왔다. 다음엔 더 자주 만나야지!!😭",image: "/placeholder.svg?height=200&width=300"},
    12: {title: "200일", content: "200일 기념일이라 특별한 날이었다. 케이크도 맞추고 재밌는 하루였다.", image: "/placeholder.svg?height=200&width=300"},
    13: {title: "봄나들이", content: "날씨가 좋아서 공원에 나들이를 갔다. 꽃이 많이 펴서 사진을 많이 찍었다.", image: "/placeholder.svg?height=200&width=300"},


    // ...Array.from({length: 31}, (_, i) => i + 1)
    // .filter(day=> ![1,7,12,13].includes(day)) // 스크랩된 날짜 제외
    // .reduce((acc, day) => {
    //     acc[day]={
    //         title: '일기를 작성하지 않았습니다.',
    //         content: '오늘은 일기를 작성하지 않았습니다.',
    //         image: undefined
    //     }
    //     return acc
    // }, {} as Record<number, DiaryEntry>)
}

//날짜별 일정 데이터
const initialScheduleData: Record<number, Schedule[]> = {
  21: [
    { id: "g1", title: "프로젝트 미팅", time: "09:00", description: "분기별 프로젝트 리뷰" },
    { id: "g2", title: "점심 약속", time: "12:30", description: "동료와 점심" },
    { id: "g3", title: "보고서 작성", time: "14:00", description: "월간 보고서 마무리" },
    { id: "g4", title: "온라인 강의", time: "16:00", description: "새로운 기술 학습" },
  ],
  22: [
    { id: "g5", title: "운동", time: "18:00", description: "헬스장 운동" },
    { id: "g6", title: "친구와 저녁", time: "19:30", description: "오랜만에 친구와 식사" },
    { id: "g7", title: "영화 관람", time: "21:00", description: "새로 나온 영화 보기" },
  ],
  23: [
    { id: "g8", title: "가족 저녁", time: "19:00", description: "가족과 저녁 식사" },
    { id: "g9", title: "독서 시간", time: "21:00", description: "자기계발 서적 읽기" },
    { id: "g10", title: "내일 계획", time: "22:00", description: "내일 할 일 정리" },
  ],
  24: [
    { id: "g11", title: "팀 회의", time: "10:00", description: "월간 팀 미팅" },
    { id: "g12", title: "약속", time: "12:00", description: "친구와 점심" },
    { id: "g13", title: "개인 프로젝트", time: "14:00", description: "사이드 프로젝트 진행" },
    { id: "g14", title: "장보기", time: "17:00", description: "저녁 식재료 구매" },
    { id: "g15", title: "요가 수업", time: "19:00", description: "온라인 요가 클래스" },
    { id: "g16", title: "드라마 시청", time: "21:00", description: "최신 드라마 보기" },
  ],
  25: [
    { id: "g17", title: "병원 예약", time: "14:00", description: "정기 검진" },
    { id: "g18", title: "쇼핑", time: "16:00", description: "생필품 구매" },
    { id: "g19", title: "카페에서 작업", time: "10:00", description: "집중해서 작업하기" },
    { id: "g20", title: "친구 생일 파티", time: "19:00", description: "친구 생일 축하" },
  ],
  26: [
    { id: "g21", title: "독서 모임", time: "15:00", description: "월간 독서 모임" },
    { id: "g22", title: "집안일", time: "10:00", description: "대청소 및 빨래" },
    { id: "g23", title: "산책", time: "17:00", description: "공원 산책" },
  ],
}

export default function MoodCalendar(){
    const [month, setMonth]= useState<Date>(new Date(2025,4))
    const {toast} = useToast();
    const [, navigate]=useLocation();
    const [selectedDate, setSelectedDate]=useState<Date | undefined>(undefined)
    const [showScrapedOnly, setShowScrapedOnly]=useState<boolean>(true)
    const [showAddSheduleModal, setShowAddSheduleModal]=useState<boolean>(false)
    const [selectedScheduleIds, setSelectedScheduleIds]=useState<string[]>([])
    const [scheduledDataState, setScheduleDataState]=useState<Record<number, Schedule[]>>(initialScheduleData)
    const [newSchedule, setNewSchedule]=useState<Schedule>({
        id: "",
        title: "",
        time: "",
        description: ""
    })

    const { toast } = useToast()

    const today=23

    const selectedDayNum=selectedDate?.getDate()
    const selectedDiary=
      selectedDayNum && selectedDayNum <= today ? diaryData[selectedDayNum] : undefined

    const selectedDateSchedules=selectedDayNum ? scheduledDataState[selectedDayNum] || []: []
    const showScheduleSelection = !!selectedDayNum && !selectedDiary

    const inThisMonth=(d: Date)=>
      d.getFullYear()===month.getFullYear() && d.getMonth()===month.getMonth()
    const dayNumber=(d:Date)=> d.getDate()


    const modifiers=useMemo(
      ()=>({
        today:(d: Date)=> inThisMonth(d) && dayNumber(d)===today,
        hasEmoji:(d: Date) => {
          if (!inThisMonth(d)) return false
          const n= dayNumber(d)
          const data=moodData[n]
          if (!data) return false
          if (showScrapedOnly) return data?.isScraped
          return n <= today

        },
        
      })
      , [month, showScrapedOnly, today]
    )
    
    const modifiersClassNames={
      today:"ring-2 ring-green-500 rounded-md",
      selected: "bg-green-200 text-gray-900 rounded-md",
      hasEmoji: "relative",
    }


    const navigateMonth=(direction: "prev" | "next")=>{
        setMonth((prev) => {
          const d=new Date(prev)
            d.setMonth(prev.getMonth()+(direction==="next"?1:-1))
            return d
        })
        setSelectedDate(undefined)
        setSelectedScheduleIds([])
    }

    const handleScheduleSelect=(scheduleID: string)=>{
      setSelectedScheduleIds((prev)=>
        prev.includes(scheduleID) ? prev.filter(id => id !== scheduleID) : [...prev, scheduleID]
      )
    }

    const handleAddSchedule=()=>{
      if (!selectedDayNum){
        toast({title:"오류", description:"일정을 추가할 날짜를 선택해주세요.", variant:"destructive"})
        return
      }

      if (!newSchedule.title || !newSchedule.time){
        toast({title: "오류", description:"일정 제목과 시간을 입력해주세요.", variant:"destructive"})
        return
      }

      const newId=`user-${Date.now()}`
      const added: Schedule={
        id: newId,
        title: newSchedule.title,
        time: newSchedule.time,
        description: newSchedule.description,
      }
      setScheduleDataState((prev)=>({
        ...prev,
        [selectedDayNum]: [...(prev[selectedDayNum] || []), added].sort((a,b)=>a.time.localeCompare(b.time)),
      }))
      toast({title:"일정 추가 완료", description: `${newSchedule.title} 일정이 추가되었습니다.`})
      setShowAddSheduleModal(false)
      setNewSchedule({id: "", title: "", time: "", description: ""})
    }

    const handleTalkToAgent=()=>{
      if (selectedScheduleIds.length>0 && selectedDayNum){
        const schedulesForAgent=selectedDateSchedules.filter((s)=>selectedScheduleIds.includes(s.id))
        alert(`AI Agent와 대화: ${schedulesForAgent.map(s => `${s.title} (${s.time})`).join(", ")}`)
    } else {
      alert("일정을 하나 이상 선택해주세요.")
    }
}






return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="gradient-bg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <Button variant="ghost" size="icon" className="text-gray-700">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Calendar</h1>
          <Button variant="ghost" size="icon" className="text-gray-700" onClick={() => alert("마이페이지로 이동")}>
            <User className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar px-4 pb-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full relative">
            {/* Switch (캘린더 박스 우측 상단) */}
            <div className="absolute top-4 right-4 z-10">
              <Switch checked={showScrapedOnly} onCheckedChange={setShowScrapedOnly} className="data-[state=checked]:bg-green-600" />
            </div>

            {/* DayPicker: 기본 헤더(월/이전/다음) 사용 */}
            <DayPicker
              mode="single"
              month={month}
              onMonthChange={(m) => {
                setMonth(m)
                setSelectedDate(undefined)
                setSelectedScheduleIds([])
              }}
              selected={selectedDate}
              onSelect={(d) => {
                setSelectedDate(d)
                setSelectedScheduleIds([])
              }}
              showOutsideDays
              locale={ko}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              components={{
                DayContent: (props) => {
                  const n = props.date.getDate()
                  const showEmoji = inThisMonth(props.date) && modifiers.hasEmoji(props.date)
                  return (
                    <div className="flex flex-col items-center justify-start">
                      <span className="text-xs">{n}</span>
                      {showEmoji && moodData[n]?.emoji && (
                        <span className={`text-xs mt-0.5 ${moodData[n].isScraped ? "opacity-100" : "opacity-70"}`}>
                          {moodData[n].emoji}
                        </span>
                      )}
                    </div>
                  )
                },
              }}
            />

            {/* 선택된 날짜의 일기 내용 */}
            {selectedDayNum && selectedDiary && (
              <div className="mt-6 space-y-4">
                <div className="text-lg font-semibold text-gray-800">
                  {month.getMonth() + 1}/{selectedDayNum}
                </div>
                <div className="bg-green-100 rounded-lg p-4 border-l-4 border-green-400">
                  <h3 className="font-semibold text-gray-800 mb-2">{selectedDiary.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedDiary.content}</p>
                </div>
                {selectedDiary.image && (
                  <div className="mt-4">
                    <img
                      src={selectedDiary.image || "/placeholder.svg"}
                      alt={selectedDiary.title}
                      className="w-full h-48 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 일정 선택 화면 (일기가 없는 날짜에만 표시) */}
            {showScheduleSelection && (
              <div className="mt-6 space-y-4">
                <div className="text-center text-gray-700 font-medium">일기를 쓸 당신의 하루를 선택하세요</div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedDateSchedules.length > 0 ? (
                    selectedDateSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        onClick={() => handleScheduleSelect(schedule.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedScheduleIds.includes(schedule.id) ? "bg-green-500 text-white" : "bg-green-400 text-white hover:bg-green-500"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{schedule.title}</div>
                            <div className="text-sm opacity-90">
                              {month.getMonth() + 1}월 {selectedDayNum}일
                            </div>
                          </div>
                          <div className="text-sm font-medium">{schedule.time}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <div className="text-sm">이 날짜에는 일정이 없습니다</div>
                    </div>
                  )}
                  {/* 새 일정 추가 버튼 */}
                  <div
                    onClick={() => setShowAddScheduleModal(true)}
                    className="p-4 bg-green-300 rounded-lg cursor-pointer hover:bg-green-400 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 고정 버튼들 */}
        <div className="flex-shrink-0 p-4 bg-white rounded-b-2xl shadow-lg">
          <div className="space-y-2">
            {showScheduleSelection && (
              <Button onClick={handleTalkToAgent} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                {"Let's talk to Emory Agent"}
              </Button>
            )}
          </div>
        </div>

        {/* 일정 추가 모달 */}
        {showAddScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
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
                  <Button onClick={handleAddSchedule} className="flex-1 bg-green-600 hover:bg-green-700">
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
      <Toaster />
    </div>
  )
}


