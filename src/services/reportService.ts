import type { WeeklyReportResponse, MonthlyReportResponse } from '../types/reports';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의
interface BackendEmotionStat {
  emotion: string;
  count: number;
  percentage: number;
}

interface BackendReportResponse {
  periodStart: string;
  periodEnd: string;
  reportType: string;
  emotionStats: BackendEmotionStat[];
  totalDiaryCount: number;
  dominantEmotion: string;
}

// 타임아웃이 있는 fetch 함수
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: API call took too long to respond');
    }
    throw error;
  }
};

// 인증 토큰 가져오기
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// 백엔드 응답을 프론트엔드 Weekly 타입으로 변환
const adaptWeeklyReport = (backendData: BackendReportResponse): WeeklyReportResponse => {
  return {
    success: true,
    message: 'Success',
    data: {
      weekStartDate: backendData.periodStart,
      weekEndDate: backendData.periodEnd,
      totalDiaries: backendData.totalDiaryCount,
      emotionStatistics: backendData.emotionStats.map(stat => ({
        emotionCategory: stat.emotion,
        count: stat.count,
        percentage: stat.percentage,
      })),
      mostFrequentEmotions: backendData.dominantEmotion,
    },
  };
};

// 백엔드 응답을 프론트엔드 Monthly 타입으로 변환
const adaptMonthlyReport = (backendData: BackendReportResponse): MonthlyReportResponse => {
  // yearMonth는 periodStart에서 YYYY-MM 형식으로 추출
  const yearMonth = backendData.periodStart.substring(0, 7);

  return {
    success: true,
    message: 'Success',
    data: {
      yearMonth: yearMonth,
      totalDiaries: backendData.totalDiaryCount,
      emotionStatistics: backendData.emotionStats.map(stat => ({
        emotionCategory: stat.emotion,
        count: stat.count,
        percentage: stat.percentage,
      })),
      mostFrequentEmotions: backendData.dominantEmotion,
    },
  };
};

export const reportService = {
  async getWeeklyReport(targetDate: string): Promise<WeeklyReportResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/report/weekly/${targetDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Weekly report fetch failed: ${response.status} ${response.statusText}`);
      }

      const backendData: BackendReportResponse = await response.json();
      return adaptWeeklyReport(backendData);
    } catch (error) {
      console.error('Weekly report API error:', error);
      throw new Error(`Failed to fetch weekly report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async getMonthlyReport(yearMonth: string): Promise<MonthlyReportResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/report/monthly/${yearMonth}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Monthly report fetch failed: ${response.status} ${response.statusText}`);
      }

      const backendData: BackendReportResponse = await response.json();
      return adaptMonthlyReport(backendData);
    } catch (error) {
      console.error('Monthly report API error:', error);
      throw new Error(`Failed to fetch monthly report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
