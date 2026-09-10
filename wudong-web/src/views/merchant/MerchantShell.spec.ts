import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantShell from './MerchantShell.vue';
import { useAuthStore } from '@/stores/auth';
import type { MerchantInfo } from '@/api/types';

// 外壳只在 onMounted 里按需拉取身份；这里直接种 store，仍把两个数据层 mock 掉以免真发请求
vi.mock('@/api/auth', () => ({
  memberInfo: vi.fn(),
  loginByPassword: vi.fn(),
  register: vi.fn(),
}));
vi.mock('@/api/merchant', () => ({ merchantMy: vi.fn() }));

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

async function mountShell() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/merchant',
        name: 'merchant',
        component: MerchantShell,
        children: [
          { path: '', name: 'merchant-home', component: { template: '<div>home</div>' } },
          { path: 'apply', name: 'merchant-apply', component: { template: '<div>apply</div>' } },
          { path: 'hotels', name: 'merchant-hotels', component: { template: '<div>hotels</div>' } },
        ],
      },
    ],
  });
  await router.push('/merchant');
  await router.isReady();
  const wrapper = mount(MerchantShell, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantShell', () => {
  it('商家正常（status=1）时显示「营业中」', async () => {
    useAuthStore().merchant = { ...merchantFixture, status: 1 };
    const { wrapper } = await mountShell();

    expect(wrapper.find('.merchant-shop-meta .tag').text()).toBe('营业中');
  });

  it('商家被平台停用（status=0）时显示「已禁用」而不是「营业中」', async () => {
    // 与首页「店铺状态」列（status!==1 → 已禁用）保持一致，不能同一份数据两处相反
    useAuthStore().merchant = { ...merchantFixture, status: 0 };
    const { wrapper } = await mountShell();

    const tag = wrapper.find('.merchant-shop-meta .tag');
    expect(tag.text()).toBe('已禁用');
    expect(tag.classes()).toContain('tag-off');
    expect(wrapper.text()).not.toContain('营业中');
  });

  it('未入驻时显示「未入驻」', async () => {
    const { wrapper } = await mountShell();

    expect(wrapper.find('.merchant-shop-meta .tag').text()).toBe('未入驻');
  });
});
