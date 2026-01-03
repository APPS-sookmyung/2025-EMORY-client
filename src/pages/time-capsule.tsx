"use client"

import { useEffect, useState } from "react"
import { Tag } from "lucide-react"
import { Card } from "../components/ui/card"
import Hamburger from "../components/common/Hamburger"
import { timecapsuleService, type TimecapsuleResponseDto } from "../services/timecapsuleService"
import { useToast } from "../hooks/use-toast"
import { useLocation } from "wouter"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function TimeCapsulePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [timecapsule, setTimecapsule] = useState<TimecapsuleResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 타임캡슐 데이터 로드
  useEffect(() => {
    const loadTimecapsule = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await timecapsuleService.getTimecapsule();
        setTimecapsule(data);
      } catch (err) {
        console.error('Failed to load timecapsule:', err);
        const errorMessage = err instanceof Error ? err.message : '타임캡슐을 불러오는데 실패했습니다.';
        setError(errorMessage);

        if (errorMessage.includes('No timecapsule data')) {
          toast({
            title: "타임캡슐 없음",
            description: "작년 이맘때의 일기가 없습니다.",
          });
        } else {
          toast({
            title: "타임캡슐 로드 실패",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadTimecapsule();
  }, [toast]);

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 이미지 URL 생성
  const getImageUrl = (imageId: string) => {
    return `${API_BASE_URL}/images/${imageId}`;
  };

  return (
    <div className="gradient-time-capsule">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 flex-shrink-0">
        <Hamburger />
        <Tag className="w-8 h-8 text-pink-800" />
        <div className="w-6"></div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-pink-900">그해 오늘</h1>
          </div>
          {timecapsule && (
            <p className="text-pink-800 text-sm ml-3">
              {formatDate(timecapsule.weekStart)} - {formatDate(timecapsule.weekEnd)} 주간의 추억입니다!
            </p>
          )}
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-pink-800">타임캡슐을 여는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-pink-600 text-center mb-4">
              {error.includes('No timecapsule data')
                ? '작년 이맘때의 일기가 없습니다.'
                : '타임캡슐을 불러올 수 없습니다.'}
            </div>
            <button
              onClick={() => navigate('/diary-preview')}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              일기 보러 가기
            </button>
          </div>
        )}

        {/* 데이터가 있을 때 */}
        {!loading && !error && timecapsule && timecapsule.diaries.length > 0 && (
          <>
            {/* 대표 이미지와 요약 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* 왼쪽 대표사진 */}
              <Card
                className="aspect-square overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl cursor-pointer"
                onClick={() => navigate(`/diary/${timecapsule.diaries[0].diaryId}`)}
              >
                {timecapsule.diaries[0].imageId ? (
                  <img
                    src={getImageUrl(timecapsule.diaries[0].imageId)}
                    alt="대표 사진"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
                    <span className="text-pink-400">이미지 없음</span>
                  </div>
                )}
              </Card>

              {/* 오른쪽 정보 */}
              <Card className="aspect-square bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                <div className="h-full p-4 flex flex-col items-center justify-center bg-gradient-to-br from-white to-pink-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600 mb-2">
                      {timecapsule.diaries.length}개
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      작년 이맘때<br />
                      {timecapsule.diaries.length}개의<br />
                      추억을 기록했어요
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 나머지 이미지들 */}
            {timecapsule.diaries.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {timecapsule.diaries.slice(1, 7).map((diary) => (
                  <Card
                    key={diary.diaryId}
                    className="aspect-square bg-white/60 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/diary/${diary.diaryId}`)}
                  >
                    {diary.imageId ? (
                      <img
                        src={getImageUrl(diary.imageId)}
                        alt={`${formatDate(diary.date)} 추억`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
                        <div className="text-center text-xs text-pink-400">
                          {formatDate(diary.date)}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* 더 많은 일기가 있을 경우 */}
            {timecapsule.diaries.length > 7 && (
              <div className="text-center mt-4 text-sm text-pink-600">
                외 {timecapsule.diaries.length - 7}개의 추억이 더 있습니다
              </div>
            )}
          </>
        )}

        {/* 데이터가 없을 때 */}
        {!loading && !error && timecapsule && timecapsule.diaries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-pink-600 text-center mb-4">
              작년 이맘때의 일기가 없습니다.
            </div>
            <button
              onClick={() => navigate('/diary-write')}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              오늘의 일기 쓰기
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
