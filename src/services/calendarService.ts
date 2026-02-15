// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의 (CalendarDateDto)
export interface CalendarDateDto {
  date: string; // LocalDate -> YYYY-MM-DD
  hasDiary: boolean;
  emotion: string | null;
  isScraped: boolean;
}

// 백엔드 응답 타입 정의 (DiaryDetailDto)
export interface DiaryDetailDto {
  diaryId: string;
  title: string;
  content: string;
  emotion: string;
  imageId: string | null;
  scraped: boolean;
}

// 백엔드 응답 타입 정의 (EventResponseDto)
export interface EventResponseDto {
  eventId: string;
  title: string;
  date: string; // LocalDate -> YYYY-MM-DD
  startTime: string | null; // LocalTime -> HH:mm:ss
  description: string | null;
  createdAt: string; // LocalDateTime -> ISO 8601
}

// 백엔드 응답 타입 정의 (CalendarResponseDto)
export interface CalendarResponseDto {
  year: number;
  month: number;
  dates: CalendarDateDto[];
}

// 백엔드 응답 타입 정의 (DateDetailResponseDto)
export interface DateDetailResponseDto {
  date: string;
  diary: DiaryDetailDto | null;
  events: EventResponseDto[];
}

// 일정 생성 요청 (EventRequestDto)
export interface EventCreateRequest {
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (required)
  description?: string;
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

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인해주세요.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const calendarService = {
  // 월별 달력 데이터 조회
  async getMonthCalendar(year: number, month: number, scrapedOnly: boolean = false): Promise<CalendarResponseDto> {
    const url = scrapedOnly
      ? `${API_BASE_URL}/calendar/${year}/${month}?scrapedOnly=true`
      : `${API_BASE_URL}/calendar/${year}/${month}`;

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      throw new Error(`캘린더 조회 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // 특정 날짜 상세 정보 조회
  async getDateDetail(date: string): Promise<DateDetailResponseDto> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/calendar/date/${date}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      throw new Error(`날짜 상세 조회 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // 일정 등록
  async createEvent(request: EventCreateRequest): Promise<EventResponseDto> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/calendar/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      if (response.status === 400) {
        throw new Error('입력값을 확인해주세요. 제목, 날짜, 시작 시간은 필수입니다.');
      }
      throw new Error(`일정 등록 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // 일정 삭제
  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/calendar/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      if (response.status === 404) {
        throw new Error('해당 일정을 찾을 수 없습니다.');
      }
      throw new Error(`일정 삭제 실패: ${response.status} ${response.statusText}`);
    }
  },
};
