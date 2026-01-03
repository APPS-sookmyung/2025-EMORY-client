// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의
export interface TimecapsuleImageDto {
  diaryId: string;
  imageId: string;
  date: string; // LocalDate -> YYYY-MM-DD
}

export interface TimecapsuleResponseDto {
  targetDate: string; // 작년 오늘
  weekStart: string; // 작년 오늘이 속한 주의 시작일
  weekEnd: string; // 작년 오늘이 속한 주의 종료일
  diaries: TimecapsuleImageDto[];
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

export const timecapsuleService = {
  // 타임캡슐 조회 (작년 같은 주의 일기)
  async getTimecapsule(): Promise<TimecapsuleResponseDto> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/timecapsule`, {
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
        if (response.status === 404) {
          throw new Error('No timecapsule data found for last year.');
        }
        throw new Error(`Failed to fetch timecapsule: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Timecapsule API error:', error);
      throw new Error(`Failed to fetch timecapsule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
