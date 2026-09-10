import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * uploadImage 自建 fetch，绕过了 http.ts 的统一收发，必须自己把
 * 「登录失效 → 清 token + 跳 /login」接回去（否则 401/1001 时登录态挂着不动）。
 * USE_MOCK 在模块顶层求值，因此先设环境变量、再 resetModules 动态导入；
 * http 与 upload 必须在同一次 reset 后导入，才能共用同一个模块实例（handler 才连得上）。
 */
const loadModules = async () => {
  vi.resetModules();
  vi.stubEnv('VITE_USE_MOCK', 'false');
  const http = await import('./http');
  const upload = await import('./upload');
  return { http, upload };
};

const pngFile = (name = 'a.png') => new File(['x'], name, { type: 'image/png' });

describe('uploadImage 的鉴权失效处理', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('code 1001 且 message 以登录失效开头：触发回调且仍然抛 ApiError', async () => {
    const { http, upload } = await loadModules();
    let calls = 0;
    http.setUnauthorizedHandler(() => {
      calls += 1;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: 1001, message: '登录失效~' }),
      })
    );

    const p = upload.uploadImage(pngFile());
    await expect(p).rejects.toBeInstanceOf(http.ApiError);
    await expect(p).rejects.toThrow(/登录失效/);
    expect(calls).toBe(1);
    http.setUnauthorizedHandler(null);
  });

  it('HTTP 401：触发回调且仍然抛 ApiError', async () => {
    const { http, upload } = await loadModules();
    let calls = 0;
    http.setUnauthorizedHandler(() => {
      calls += 1;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) })
    );

    await expect(upload.uploadImage(pngFile())).rejects.toThrow('HTTP 401');
    expect(calls).toBe(1);
    http.setUnauthorizedHandler(null);
  });

  it('普通业务错误不触发回调', async () => {
    const { http, upload } = await loadModules();
    let calls = 0;
    http.setUnauthorizedHandler(() => {
      calls += 1;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: 1001, message: '文件类型不支持' }),
      })
    );

    await expect(upload.uploadImage(pngFile())).rejects.toThrow('文件类型不支持');
    expect(calls).toBe(0);
    http.setUnauthorizedHandler(null);
  });
});
