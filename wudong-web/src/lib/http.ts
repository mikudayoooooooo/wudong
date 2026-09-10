/**
 * HTTP 层：裸 JWT 头 + cool-admin 封套解包
 * 后端约定：成功 {code:1000, data}；业务失败 HTTP 200 + {code:1001, message}
 * 1001（含"登录失效"）→ 清登录态并抛出中文 message
 */
const TOKEN_KEY = 'wd_token';
const REFRESH_KEY = 'wd_refresh_token';

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}
export function setTokens(token: string, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
export function getRefreshToken(): string {
  return localStorage.getItem(REFRESH_KEY) || '';
}

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

type Listener = () => void;
const unauthorizedListeners: Listener[] = [];
export function onUnauthorized(fn: Listener) {
  unauthorizedListeners.push(fn);
}

async function request<T = any>(
  method: 'GET' | 'POST',
  url: string,
  data?: any
): Promise<T> {
  const headers: Record<string, string> = {};
  if (data !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = token; // 裸 token，无 Bearer

  const res = await fetch(`/api${url}`, {
    method,
    headers,
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (body.code !== 1000) {
    if (body.code === 1001) {
      for (const fn of unauthorizedListeners) fn();
    }
    throw new ApiError(body.code ?? 1001, body.message || '请求失败');
  }
  return body.data as T;
}

export const http = {
  get: <T = any>(url: string) => request<T>('GET', url),
  post: <T = any>(url: string, data?: any) => request<T>('POST', url, data),
};
