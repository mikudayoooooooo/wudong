// 轻量请求封装：/app/** 与 /admin/**，code===1000 返回 data，否则抛 ApiError。
// query 以 encodeURIComponent 手动拼接（空格 → %20，而非 +）。
// 鉴权头是【裸 token】（无 Bearer 前缀），与 cool 中间件 jwt.verify(ctx.get('Authorization')) 一致。
// 未登录时后端返回 HTTP 200 + {code:1001,message:'登录失效~'}，业务错误同样 code:1001，
// 因此只能靠 message 前缀识别鉴权失败（不能靠 code）。
interface Envelope<T> {
  code: number;
  message?: string;
  data?: T;
}

/** 接口错误（携带业务 code 与 message） */
export class ApiError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/** 当前登录 token（裸 JWT）；由 stores/auth 在登录/登出时同步 */
let authToken: string | null = null;
/** 鉴权失败回调（清 token + 跳登录），由 stores/auth 注册 */
let unauthorizedHandler: (() => void) | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

/** 拼接 query string：跳过 null/undefined/''，值经 encodeURIComponent */
const buildQuery = (query?: Record<string, unknown>): string => {
  if (!query) return '';
  const parts: string[] = [];
  for (const [k, v] of Object.entries(query)) {
    if (v === '' || v == null) continue;
    parts.push(`${k}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
};

const isAuthFailure = (message?: string): boolean =>
  typeof message === 'string' && message.startsWith('登录失效');

/** 统一收发：GET 走 query，POST 走 JSON body；鉴权失败先回调再抛错 */
const doFetch = async <T>(
  method: 'GET' | 'POST',
  path: string,
  query?: Record<string, unknown>,
  body?: Record<string, unknown>
): Promise<T> => {
  const url = method === 'GET' ? `${path}${buildQuery(query)}` : path;
  const headers: Record<string, string> = {};
  if (authToken) headers.Authorization = authToken;

  const init: RequestInit = { method, headers };
  if (method === 'POST') {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body ?? {});
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    if (res.status === 401) unauthorizedHandler?.();
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }
  const json = (await res.json()) as Envelope<T>;
  if (json.code !== 1000) {
    if (isAuthFailure(json.message)) unauthorizedHandler?.();
    throw new ApiError(json.message || '接口异常', json.code);
  }
  return json.data as T;
};

/** GET 请求 */
export const request = <T>(
  path: string,
  query?: Record<string, unknown>
): Promise<T> => doFetch<T>('GET', path, query);

/** POST 请求（JSON body） */
export const post = <T>(
  path: string,
  body?: Record<string, unknown>
): Promise<T> => doFetch<T>('POST', path, undefined, body);
