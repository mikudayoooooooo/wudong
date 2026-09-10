import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './auth';
import { setAuthToken } from '../api/http';

const okJson = (data: unknown) => ({
  ok: true,
  json: async () => ({ code: 1000, data }),
});

/** 按 URL 分派的 fetch 打桩 */
const stubRoutes = (routes: Record<string, unknown>) => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const key = Object.keys(routes).find((k) => url.startsWith(k));
      if (!key) throw new Error(`unexpected url: ${url}`);
      return Promise.resolve(okJson(routes[key]));
    })
  );
};

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    // http 层的 authToken 是模块级变量，会跨用例存活（上一个用例登录后残留），
    // 必须显式复位，否则"登录请求本身不带 token"断言会被上一用例污染。
    setAuthToken(null);
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('未登录时 isLoggedIn / isMerchant 均为 false', () => {
    const auth = useAuthStore();
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.isMerchant).toBe(false);
  });

  it('密码登录后保存 token 并加载会员与店铺', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-1' },
      '/app/member/info/person': { id: 7, phone: '13800000000', role: 2 },
      '/app/merchant/my': {
        id: 3,
        userId: 7,
        username: 'm7',
        shopName: '苗银世家',
        module: 'accommodation',
        contactName: '张三',
        contactPhone: '13800000000',
        status: 1,
      },
    });
    const auth = useAuthStore();
    await auth.login('13800000000', 'abc123456');

    expect(auth.token).toBe('jwt-1');
    expect(localStorage.getItem('wudong_token')).toBe('jwt-1');
    expect(auth.member?.id).toBe(7);
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.isMerchant).toBe(true);
    expect(auth.merchant?.shopName).toBe('苗银世家');
  });

  it('登录后请求自动带裸 token', async () => {
    const headers: any[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init: any) => {
        headers.push(init?.headers ?? {});
        if (url.startsWith('/app/member/login/password')) {
          return Promise.resolve(okJson({ token: 'jwt-9' }));
        }
        if (url.startsWith('/app/member/info/person')) {
          return Promise.resolve(okJson({ id: 1, phone: '1', role: 1 }));
        }
        return Promise.resolve({ ok: true, json: async () => ({ code: 1000 }) });
      })
    );
    const auth = useAuthStore();
    await auth.login('13800000000', 'abc123456');
    expect(headers[0].Authorization).toBeUndefined(); // 登录请求本身不带 token
    expect(headers[1].Authorization).toBe('jwt-9'); // 后续请求带裸 token
  });

  it('未入驻会员 isMerchant 为 false（cool 不输出 data 键）', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-2' },
      '/app/member/info/person': { id: 8, phone: '13800000001', role: 1 },
      // 未入驻：后端不输出 data 键 → request 得到 undefined → merchantMy 归 null
      '/app/merchant/my': undefined,
    });
    const auth = useAuthStore();
    await auth.login('13800000001', 'abc123456');
    expect(auth.merchant).toBeNull();
    expect(auth.isMerchant).toBe(false);
  });

  it('店铺被禁用的商家 isMerchant 为 false', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-3' },
      '/app/member/info/person': { id: 9, phone: '13800000002', role: 2 },
      '/app/merchant/my': { id: 4, shopName: 'x', status: 0, module: 'accommodation' },
    });
    const auth = useAuthStore();
    await auth.login('13800000002', 'abc123456');
    expect(auth.isMerchant).toBe(false);
  });

  it('注册成功即登录并加载身份', async () => {
    stubRoutes({
      '/app/member/login/smsCode': { code: '123456' },
      '/app/member/login/register': { token: 'jwt-reg' },
      '/app/member/info/person': { id: 10, phone: '13800000003', role: 1 },
      // 注册后尚未入驻：仍需给出该路由，否则 stubRoutes 会以 unexpected url 抛错
      '/app/merchant/my': undefined,
    });
    const auth = useAuthStore();
    await auth.registerAndLogin({
      phone: '13800000003',
      smsCode: '123456',
      password: 'abc123456',
    });
    expect(auth.token).toBe('jwt-reg');
    expect(auth.member?.id).toBe(10);
  });

  it('退出清空 token / 会员 / 店铺与本地存储', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-4' },
      '/app/member/info/person': { id: 11, phone: '13800000004', role: 2 },
      '/app/merchant/my': { id: 5, shopName: 'y', status: 1, module: 'accommodation' },
    });
    const auth = useAuthStore();
    await auth.login('13800000004', 'abc123456');
    auth.logout();
    expect(auth.token).toBe('');
    expect(auth.member).toBeNull();
    expect(auth.merchant).toBeNull();
    expect(localStorage.getItem('wudong_token')).toBeNull();
  });

  it('已持久化 token 时初始化即为登录态（不请求）', () => {
    localStorage.setItem('wudong_token', 'jwt-saved');
    const auth = useAuthStore();
    expect(auth.token).toBe('jwt-saved');
    expect(auth.isLoggedIn).toBe(true);
  });
});
