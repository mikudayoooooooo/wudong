// 轻量请求封装：GET /app/**，code===1000 返回 data，否则抛 ApiError。
// query 以 encodeURIComponent 手动拼接（空格 → %20，而非 +）。
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

/**
 * GET 请求。
 * - 先检查 res.ok（网络/HTTP 错误 → ApiError('HTTP xxx')）
 * - 再检查 json.code === 1000，是则返回 data；否则抛 ApiError(message, code)
 */
export const request = async <T>(path: string, query?: Record<string, unknown>): Promise<T> => {
  const url = `${path}${buildQuery(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }
  const json = (await res.json()) as Envelope<T>;
  if (json.code !== 1000) {
    throw new ApiError(json.message || '接口异常', json.code);
  }
  return json.data as T;
};
