import type { WeeklyReportResponse, MonthlyReportResponse } from '../types/reports';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

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

// JSON 응답 검증 함수
const validateJsonResponse = async (response: Response): Promise<any> => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// 나중에 실제 API 연결시 사용할 서비스
export const reportService = {
  async getWeeklyReport(targetDate: string): Promise<WeeklyReportResponse> {
    // TODO: 실제 API 연결시 아래 주석 해제하고 더미 데이터 제거
    /*
    try {
      const response = await fetchWithTimeout(`/api/reports/weekly?targetDate=${targetDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Weekly report fetch failed: ${response.status} ${response.statusText}`);
      }

      return await validateJsonResponse(response);
    } catch (error) {
      console.error('Weekly report API error:', error);
      throw new Error(`Failed to fetch weekly report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    */

    // 더미 데이터 (실제 API 응답 형식)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Success",
          data: {
            weekStartDate: "2025-07-27",
            weekEndDate: "2025-08-02",
            totalDiaries: 2,
            emotionStatistics: [
              {
                emotionCategory: "SOSO",
                count: 1,
                percentage: 50.0
              },
              {
                emotionCategory: "HAPPY",
                count: 1,
                percentage: 50.0
              }
            ],
            mostFrequentEmotions: "보통, 행복"
          }
        });
      }, 1000);
    });
  },

  async getMonthlyReport(yearMonth: string): Promise<MonthlyReportResponse> {
    // TODO: 실제 API 연결시 아래 주석 해제하고 더미 데이터 제거
    /*
    try {
      const response = await fetchWithTimeout(`/api/reports/monthly?yearMonth=${yearMonth}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Monthly report fetch failed: ${response.status} ${response.statusText}`);
      }

      return await validateJsonResponse(response);
    } catch (error) {
      console.error('Monthly report API error:', error);
      throw new Error(`Failed to fetch monthly report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    */

    // 더미 데이터 (실제 API 응답 형식)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Success",
          data: {
            yearMonth: "2025-08",
            totalDiaries: 3,
            emotionStatistics: [
              {
                emotionCategory: "HAPPY",
                count: 2,
                percentage: 66.67
              },
              {
                emotionCategory: "SOSO",
                count: 1,
                percentage: 33.33
              }
            ],
            mostFrequentEmotions: "행복"
          }
        });
      }, 1000);
    });
  },
};