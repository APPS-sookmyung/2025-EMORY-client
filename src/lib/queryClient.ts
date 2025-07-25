import {
  QueryClient,
  type QueryFunction,
  type QueryKey,
} from '@tanstack/react-query';
//타입스크립트 verbatimModuleSyntax 설정 -> type queryFunction

//에러방지 -> 타입 정의 최상단으로
type UnauthorizedBehavior = 'returnNull' | 'throw';

//에러 처리 : http 에러를 js 에러로 변환
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

//모든 api 호출 일관된 방식

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { 'Content-Type': 'application/json' } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include', // 쿠키, 인증 자동 포함
    //json 헤더 자동 설정
  });

  await throwIfResNotOk(res);
  return res;
}

//queryKey를 URL로 자동 변환 (queryKey.join("/"))
//인증 실패 시 null 반환 또는 에러 던지기 선택
// 타입 추론 문제 발생 ->  타입을 더 정확하게 정의
export const getQueryFn = <T = unknown>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T, QueryKey> => {
  return async ({ queryKey }) => {
    const res = await fetch(queryKey.join('/') as string, {
      credentials: 'include',
    });

    if (options.on401 === 'returnNull' && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
};

//글로벌 설정 : 자동 refetch 없음, 윈도우 포커스 시 refetch 없음, 무제한 캐시
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
