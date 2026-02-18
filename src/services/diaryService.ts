// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의 (DiaryResponse)
export interface BackendDiaryResponse {
  diaryId: string;
  title: string;
  content: string;
  emotion: string;
  imageId: string | null;
  scraped: boolean;
  status: string;
  date: string; // LocalDate -> YYYY-MM-DD
  createdAt: string; // LocalDateTime -> ISO 8601
  updatedAt: string;
}

// 백엔드 응답 타입 정의 (DiaryImage)
export interface BackendDiaryImage {
  diaryId: string;
  imageId: string;
  date: string; // LocalDate -> YYYY-MM-DD
}

// 피드백 요청 타입 (FeedbackSaveRequestDto)
export interface FeedbackSaveRequest {
  selectedOption: string;
}

// 피드백 응답 타입 (FeedbackSaveResponseDto)
export interface FeedbackSaveResponse {
  feedbackId: string;
  diaryId: string;
  selectedOption: string;
  createdAt: string;
  updatedAt: string;
}

// 프론트엔드 타입 정의
export interface DiaryItem {
  id: string;
  dateLabel: string; // MM/DD 형식
  hasContent: boolean;
  bookmarked?: boolean;
  imageUrl?: string;
  title?: string;
  content?: string;
  emotion?: string;
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

// 이미지 URL 생성 (이미지 ID로부터)
const getImageUrl = (imageId: string | null): string | undefined => {
  if (!imageId) return undefined;
  // 백엔드 이미지 엔드포인트에 맞게 수정 필요
  return `${API_BASE_URL}/images/${imageId}`;
};

// 날짜 포맷 변환 (YYYY-MM-DD → MM/DD)
const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// 백엔드 응답을 프론트엔드 DiaryItem으로 변환
const adaptDiaryResponse = (backendDiary: BackendDiaryResponse): DiaryItem => {
  return {
    id: backendDiary.diaryId,
    dateLabel: formatDateLabel(backendDiary.date),
    hasContent: !!backendDiary.content,
    bookmarked: backendDiary.scraped,
    imageUrl: getImageUrl(backendDiary.imageId),
    title: backendDiary.title,
    content: backendDiary.content,
    emotion: backendDiary.emotion,
  };
};

// 백엔드 이미지 응답을 DiaryItem으로 변환
const adaptDiaryImage = (backendImage: BackendDiaryImage): DiaryItem => {
  return {
    id: backendImage.diaryId,
    dateLabel: formatDateLabel(backendImage.date),
    hasContent: true,
    imageUrl: getImageUrl(backendImage.imageId),
  };
};

export const diaryService = {
  // 전체 일기 목록 조회
  async getAllDiaries(): Promise<DiaryItem[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/diaries`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      throw new Error(`일기 목록 조회 실패: ${response.status} ${response.statusText}`);
    }

    const backendDiaries: BackendDiaryResponse[] = await response.json();
    return backendDiaries.map(adaptDiaryResponse);
  },

  // 이미지가 있는 일기 목록 조회
  async getDiaryImages(year?: number): Promise<DiaryItem[]> {
    const url = year
      ? `${API_BASE_URL}/diaries/images?year=${year}`
      : `${API_BASE_URL}/diaries/images`;

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      throw new Error(`일기 이미지 조회 실패: ${response.status} ${response.statusText}`);
    }

    const backendImages: BackendDiaryImage[] = await response.json();
    return backendImages.map(adaptDiaryImage);
  },

  // 일기 삭제
  async deleteDiary(diaryId: string): Promise<void> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/diaries/${diaryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      if (response.status === 404) {
        throw new Error('해당 일기를 찾을 수 없습니다.');
      }
      throw new Error(`일기 삭제 실패: ${response.status} ${response.statusText}`);
    }
  },

  // 북마크 토글 (스크랩 기능) — 백엔드가 자체적으로 토글, body 불필요
  async toggleBookmark(diaryId: string): Promise<BackendDiaryResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/diaries/${diaryId}/scrap`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      if (response.status === 404) {
        throw new Error('해당 일기를 찾을 수 없습니다.');
      }
      throw new Error(`북마크 토글 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // AI 일기 피드백 저장
  async saveFeedback(diaryId: string, selectedOption: string): Promise<FeedbackSaveResponse> {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/aidiary/diary/${encodeURIComponent(diaryId)}/feedback`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ selectedOption } as FeedbackSaveRequest),
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      if (response.status === 404) {
        throw new Error('해당 일기를 찾을 수 없습니다.');
      }
      if (response.status === 400) {
        throw new Error('피드백 옵션을 선택해주세요.');
      }
      throw new Error(`피드백 저장 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};
