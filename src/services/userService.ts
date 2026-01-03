// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// 백엔드 응답 타입 정의
export interface UserProfileResponse {
  email: string;
  nickname: string;
  provider: string; // "google" | "kakao"
  diaryReminderEnabled: boolean;
  reminderTime: string | null; // HH:mm 형식
}

export interface UserProfileUpdateRequest {
  nickname?: string;
  diaryReminderEnabled?: boolean;
  reminderTime?: string; // HH:mm 형식
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

export const userService = {
  // 사용자 프로필 조회
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/api/user/profile`, {
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
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('User profile API error:', error);
      throw new Error(`Failed to fetch user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 사용자 프로필 수정
  async updateProfile(data: UserProfileUpdateRequest): Promise<UserProfileResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile API error:', error);
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // 계정 삭제
  async deleteAccount(): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/api/user/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to delete account: ${response.status} ${response.statusText}`);
      }

      // 성공 시 로컬 스토리지의 토큰 제거
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Delete account API error:', error);
      throw new Error(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
