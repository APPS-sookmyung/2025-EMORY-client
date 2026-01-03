// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의
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

export interface BackendDiaryImage {
  diaryId: string;
  imageId: string;
  date: string; // LocalDate -> YYYY-MM-DD
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
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/diaries`, {
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
        throw new Error(`Failed to fetch diaries: ${response.status} ${response.statusText}`);
      }

      const backendDiaries: BackendDiaryResponse[] = await response.json();
      return backendDiaries.map(adaptDiaryResponse);
    } catch (error) {
      console.error('Diaries API error:', error);
      throw new Error(`Failed to fetch diaries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 이미지가 있는 일기 목록 조회
  async getDiaryImages(year?: number): Promise<DiaryItem[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const url = year
        ? `${API_BASE_URL}/diaries/images?year=${year}`
        : `${API_BASE_URL}/diaries/images`;

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
        throw new Error(`Failed to fetch diary images: ${response.status} ${response.statusText}`);
      }

      const backendImages: BackendDiaryImage[] = await response.json();
      return backendImages.map(adaptDiaryImage);
    } catch (error) {
      console.error('Diary images API error:', error);
      throw new Error(`Failed to fetch diary images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 일기 삭제
  async deleteDiary(diaryId: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/diaries/${diaryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to delete diary: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Delete diary API error:', error);
      throw new Error(`Failed to delete diary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 북마크 토글 (스크랩 기능)
  async toggleBookmark(diaryId: string, currentBookmarkState: boolean): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // 백엔드 API: PATCH /diaries/{id}/scrap
      const response = await fetchWithTimeout(`${API_BASE_URL}/diaries/${diaryId}/scrap`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ scraped: !currentBookmarkState }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        // 404면 엔드포인트가 없는 것이므로 로컬 상태만 업데이트
        if (response.status === 404) {
          console.warn('Bookmark API endpoint not found. Update local state only.');
          return;
        }
        throw new Error(`Failed to toggle bookmark: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Toggle bookmark API error:', error);
      // 에러가 발생해도 로컬 상태는 유지하도록 함
      console.warn('Bookmark toggle failed, but continuing with local state update.');
    }
  },
};
