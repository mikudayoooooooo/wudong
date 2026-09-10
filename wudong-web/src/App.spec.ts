import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import App from './App.vue';
import { useAuthStore } from './stores/auth';
import type { MerchantInfo } from './api/types';

// 顶栏入口只读 store，不自己发请求；把数据层 mock 掉以防意外触网
vi.mock('./api/auth', () => ({
  memberInfo: vi.fn(),
  loginByPassword: vi.fn(),
  register: vi.fn(),
}));
vi.mock('./api/merchant', () => ({ merchantMy: vi.fn() }));

const merchantFixture: MerchantInfo = {
  id: 1,
  userId: 1,
  username: 'm1',
  shopName: '乌东苗寨木楼',
  module: 'accommodation',
  contactName: '杨阿妹',
  contactPhone: '13300133001',
  status: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

async function mountApp() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>home</div>' } },
      { path: '/merchant', name: 'merchant', component: { template: '<div>merchant</div>' } },
    ],
  });
  await router.push('/');
  await router.isReady();
  const wrapper = mount(App, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('App 顶栏商家入口', () => {
  it('未登录显示「登录」', async () => {
    const { wrapper } = await mountApp();
    expect(wrapper.find('.merchant-entry').text()).toBe('登录');
  });

  it('已登录且有店铺显示店铺名', async () => {
    const auth = useAuthStore();
    auth.setToken('jwt-x');
    auth.merchant = merchantFixture;

    const { wrapper } = await mountApp();
    expect(wrapper.find('.merchant-entry').text()).toBe('乌东苗寨木楼');
  });

  it('已登录但店铺信息未知时回落到「商家中心」', async () => {
    const auth = useAuthStore();
    auth.setToken('jwt-x');
    auth.merchant = null;

    const { wrapper } = await mountApp();
    expect(wrapper.find('.merchant-entry').text()).toBe('商家中心');
  });
});
