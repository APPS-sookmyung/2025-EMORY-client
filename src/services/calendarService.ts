// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의
export interface CalendarDayDto {
  date: string; // LocalDate -> YYYY-MM-DD
  hasDiary: boolean;
  emotion: string | null;
  isScraped: boolean;
}

export interface DiaryInfoDto {
  diaryId: string;
  title: string;
  content: string;
  emotion: string;
  imageId: string | null;
}

export interface EventDto {
  id: string;
  title: string;
  description: string | null;
  date: string; // LocalDate -> YYYY-MM-DD
  startTime: string | null; // LocalTime -> HH:mm:ss
  eventType: string; // "USER_CREATED" | "GOOGLE_CALENDAR"
}

export interface CalendarResponseDto {
  year: number;
  month: number;
  days: CalendarDayDto[];
}

export interface DateDetailResponseDto {
  date: string;
  diary: DiaryInfoDto | null;
  userEvents: EventDto[];
  googleEvents: EventDto[];
}

export interface EventCreateRequest {
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
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

export const calendarService = {
  // 월별 달력 데이터 조회
  async getMonthCalendar(year: number, month: number, scrapedOnly: boolean = false): Promise<CalendarResponseDto> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const url = scrapedOnly
        ? `${API_BASE_URL}/calendar/${year}/${month}?scrapedOnly=true`
        : `${API_BASE_URL}/calendar/${year}/${month}`;

      const response = await fetchWithTimeout(url, {
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
        throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Calendar API error:', error);
      throw new Error(`Failed to fetch calendar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 특정 날짜 상세 정보 조회
  async getDateDetail(date: string): Promise<DateDetailResponseDto> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/calendar/date/${date}`, {
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
        throw new Error(`Failed to fetch date detail: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Date detail API error:', error);
      throw new Error(`Failed to fetch date detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 일정 등록
  async createEvent(request: EventCreateRequest): Promise<EventDto> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/calendar/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create event API error:', error);
      throw new Error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 일정 삭제
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/calendar/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Delete event API error:', error);
      throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
