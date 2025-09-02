import { WeeklyReportResponse, MonthlyReportResponse } from '../types/reports';

// 나중에 실제 API 연결시 사용할 서비스
export const reportService = {
  async getWeeklyReport(targetDate: string): Promise<WeeklyReportResponse> {
    // TODO: 실제 API 연결시 아래 주석 해제하고 더미 데이터 제거
    /*
    const response = await fetch(`/api/reports/weekly?targetDate=${targetDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weekly report fetch failed: ${response.status}`);
    }

    return response.json();
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
    const response = await fetch(`/api/reports/monthly?yearMonth=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Monthly report fetch failed: ${response.status}`);
    }

    return response.json();
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