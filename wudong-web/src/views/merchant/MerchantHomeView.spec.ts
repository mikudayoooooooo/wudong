import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHomeView from './MerchantHomeView.vue';
import { merchantApplication, merchantMy } from '@/api/merchant';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/api/merchant', () => ({
  merchantApplication: vi.fn(),
  merchantMy: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantMy).mockReset().mockResolvedValue(null);
  vi.mocked(merchantApplication).mockReset().mockResolvedValue(null);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant', name: 'merchant-home', component: MerchantHomeView },
      { path: '/merchant/apply', name: 'merchant-apply', component: { template: '<div>apply</div>' } },
      { path: '/merchant/hotels', name: 'merchant-hotels', component: { template: '<div>hotels</div>' } },
    ],
  });
  await router.push('/merchant');
  await router.isReady();
  const wrapper = mount(MerchantHomeView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantHomeView', () => {
  it('已入驻：展示店铺信息与「我的民宿」入口', async () => {
    vi.mocked(merchantMy).mockResolvedValue({
      id: 1,
      userId: 1,
      username: 'm1',
      shopName: '乌东苗寨木楼',
      module: 'accommodation',
      contactName: '杨阿妹',
      contactPhone: '13300133001',
      status: 1,
      joinedAt: '2026-09-01 10:00:00',
    });
    const { wrapper } = await mountView();

    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('住宿');
    expect(wrapper.text()).toContain('我的民宿');
    expect(wrapper.find('.go-apply').exists()).toBe(false);
  });

  it('未入驻且有待审核申请：提示审核中并可查看', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 1,
    });
    const { wrapper } = await mountView();

    expect(wrapper.text()).toContain('待审核');
    expect(wrapper.text()).toContain('苗银世家');
    // 审核中态渲染的是「入驻进度」卡片，其中只有「查看入驻申请」按钮；
    // 「我的民宿」入口只出现在已入驻态（本用例 merchantMy 为 null，渲染不到那里）。
    expect(wrapper.text()).toContain('查看入驻申请');
  });

  it('未入驻且无申请：引导去入驻申请', async () => {
    const { wrapper, router } = await mountView();
    expect(wrapper.text()).toContain('尚未入驻');
    const button = wrapper.find('.go-apply');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/apply');
  });

  it('申请被驳回：展示驳回原因', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 3,
      auditResult: '营业执照不清晰',
    });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('已驳回');
    expect(wrapper.text()).toContain('营业执照不清晰');
  });

  it('加载后同步店铺信息到 auth store', async () => {
    vi.mocked(merchantMy).mockResolvedValue({
      id: 2,
      userId: 1,
      username: 'm1',
      shopName: '银饰工坊',
      module: 'accommodation',
      contactName: '李四',
      contactPhone: '13300133002',
      status: 1,
    });
    const { wrapper } = await mountView();
    const auth = useAuthStore();
    expect(auth.merchant?.shopName).toBe('银饰工坊');
    expect(wrapper.text()).toContain('银饰工坊');
  });

  it('接口失败展示错误提示', async () => {
    vi.mocked(merchantMy).mockRejectedValue(new Error('登录失效~'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('登录失效');
  });
});
