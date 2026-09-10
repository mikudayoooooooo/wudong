import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import router from './index';
import { useAuthStore } from '../stores/auth';

describe('router 守卫', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.unstubAllGlobals();
    await router.replace('/');
  });

  it('未登录访问 /merchant 重定向到 /login 且带 redirect', async () => {
    await router.push('/merchant');
    expect(router.currentRoute.value.path).toBe('/login');
    expect(router.currentRoute.value.query.redirect).toBe('/merchant');
  });

  it('已登录可直接进入 /merchant', async () => {
    // 模拟“刷新页面时已有持久化 token”：先落盘再新建 pinia，
    // 使 store 的 state 初始化器能读到该 token（守卫在 beforeEach 里已实例化过 store）。
    localStorage.setItem('wudong_token', 'jwt-x');
    setActivePinia(createPinia());
    const auth = useAuthStore();
    expect(auth.isLoggedIn).toBe(true);
    await router.push('/merchant');
    expect(router.currentRoute.value.path).toBe('/merchant');
  });

  it('游客页不受守卫影响', async () => {
    await router.push('/hotels');
    expect(router.currentRoute.value.path).toBe('/hotels');
  });
});
