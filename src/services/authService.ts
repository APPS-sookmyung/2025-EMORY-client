// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 타임아웃 설정 (10초)
const API_TIMEOUT = 10000;

// OAuth 제공자 타입
export type OAuthProvider = 'google' | 'kakao';

// 백엔드 요청 타입
interface OAuthRequest {
  accessToken: string;
  provider: OAuthProvider;
}

// 백엔드 응답 타입
interface OAuthLoginResponse {
  accessToken: string;
  isNewUser: boolean;
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

export const authService = {
  /**
   * OAuth 로그인 - Google/Kakao accessToken을 백엔드로 전송하여 JWT 토큰 획득
   */
  async login(provider: OAuthProvider, accessToken: string): Promise<OAuthLoginResponse> {
    try {
      const requestBody: OAuthRequest = {
        accessToken,
        provider,
      };

      const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('잘못된 요청입니다. 로그인 정보를 확인해주세요.');
        }
        if (response.status === 401) {
          throw new Error('인증에 실패했습니다. 다시 시도해주세요.');
        }
        throw new Error(`로그인 실패: ${response.status} ${response.statusText}`);
      }

      const data: OAuthLoginResponse = await response.json();

      // JWT 토큰을 localStorage에 저장
      this.setToken(data.accessToken);

      return data;
    } catch (error) {
      console.error('OAuth login error:', error);
      throw new Error(
        `로그인에 실패했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  /**
   * 로그아웃 - localStorage에서 토큰 제거
   */
  logout(): void {
    localStorage.removeItem('token');
  },

  /**
   * JWT 토큰 저장
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  /**
   * JWT 토큰 가져오기
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * 로그인 상태 확인
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};
