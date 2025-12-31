export interface EmotionStatistic {
  emotionCategory: string;
  count: number;
  percentage: number;
}

export interface WeeklyReportData {
  weekStartDate: string;
  weekEndDate: string;
  totalDiaries: number;
  emotionStatistics: EmotionStatistic[];
  mostFrequentEmotions: string;
}

export interface MonthlyReportData {
  yearMonth: string;
  totalDiaries: number;
  emotionStatistics: EmotionStatistic[];
  mostFrequentEmotions: string;
}

export interface WeeklyReportResponse {
  success: boolean;
  message: string;
  data: WeeklyReportData;
}

export interface MonthlyReportResponse {
  success: boolean;
  message: string;
  data: MonthlyReportData;
}