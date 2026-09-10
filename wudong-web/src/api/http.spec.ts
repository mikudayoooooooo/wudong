import { describe, expect, it, vi, afterEach } from 'vitest';
import { request, ApiError, post, setAuthToken, setUnauthorizedHandler } from './http';
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
    expect(url).toBe('/app/a?page=1&kw=%E8%8B%97%20%E5%AF%A8');
  });
});

describe('post 与鉴权', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setAuthToken(null);
    setUnauthorizedHandler(null);
  });

  it('POST 发送 JSON body 且不带 token 时不加 Authorization 头', async () => {
    let init: any = null;
    vi.stubGlobal('fetch', vi.fn((_u: string, i: any) => {
      init = i;
      return { ok: true, json: async () => ({ code: 1000, data: { id: 1 } }) };
    }));
    await expect(post('/app/x', { a: 1 })).resolves.toEqual({ id: 1 });
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('设置 token 后 POST 与 GET 都带裸 token', async () => {
    const headers: any[] = [];
    vi.stubGlobal('fetch', vi.fn((_u: string, i: any) => {
      headers.push(i ? i.headers : {});
      return { ok: true, json: async () => ({ code: 1000, data: 1 }) };
    }));
    setAuthToken('jwt-abc');
    await post('/app/x', {});
    await request('/app/y');
    expect(headers[0].Authorization).toBe('jwt-abc'); // 无 Bearer 前缀
    expect(headers[1].Authorization).toBe('jwt-abc');
  });

  it('code 1001 且 message 以登录失效开头时触发 unauthorized 回调', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 1001, message: '登录失效~' }),
    }));
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    await expect(post('/app/x')).rejects.toThrow(/登录失效/);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('普通业务错误不触发 unauthorized 回调', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 1001, message: '无权操作该资源' }),
    }));
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    await expect(post('/app/x')).rejects.toThrow('无权操作该资源');
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('HTTP 401 触发 unauthorized 回调', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    }));
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    await expect(request('/admin/x')).rejects.toThrow('HTTP 401');
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
