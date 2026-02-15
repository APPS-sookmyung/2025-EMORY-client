import type {
  ChatStartRequest,
  ChatStartResponse,
  ClientSecretResponse,
  ChatSaveRequest,
} from '../types/chat';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const API_TIMEOUT = 10000;

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
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
    Authorization: `Bearer ${token}`,
  };
};

export const chatService = {
  async startSession(
    request: ChatStartRequest,
  ): Promise<ChatStartResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/ai/chat/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      throw new Error(`세션 시작 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async getClientSecret(sessionId: string): Promise<ClientSecretResponse> {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/ai/realtime/client-secret?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증에 실패했습니다. 다시 로그인해주세요.');
      }
      throw new Error(
        `Client secret 발급 실패: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  async stopSession(sessionId: string): Promise<void> {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/ai/chat/stop?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(`세션 종료 실패: ${response.status} ${response.statusText}`);
    }
  },

  async saveMessages(request: ChatSaveRequest): Promise<void> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/ai/chat/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `대화 저장 실패: ${response.status} ${response.statusText}`,
      );
    }
  },
};
