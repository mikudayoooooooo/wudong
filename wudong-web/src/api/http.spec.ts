import { describe, expect, it, vi, afterEach } from 'vitest';
import { request, ApiError } from './http';
afterEach(() => {
  vi.unstubAllGlobals();
});
describe('request', () => {
  it('code 1000 返回 data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1000, data: { a: 1 } }) }));
    await expect(request('/x')).resolves.toEqual({ a: 1 });
  });
  it('code!==1000 抛 ApiError 携带 message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1001, message: '登录失效~' }) }));
    const p = request('/x');
    await expect(p).rejects.toBeInstanceOf(ApiError);
    await expect(p).rejects.toThrow(/登录失效/);
  });
  it('query 拼接到 query string', async () => {
    let url = '';
    vi.stubGlobal('fetch', vi.fn((u: string) => { url = u; return { ok: true, json: async () => ({ code: 1000, data: 1 }) }; }));
    await request('/app/a', { page: 1, kw: '苗 寨' });
    expect(url).toBe('/api/app/a?page=1&kw=%E8%8B%97%20%E5%AF%A8');
  });
});
