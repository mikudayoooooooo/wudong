import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHotelListView from './MerchantHotelListView.vue';
import {
  merchantHotelDelete,
  merchantHotelPage,
  merchantHotelSetStatus,
} from '@/api/merchant';

vi.mock('@/api/merchant', () => ({
  merchantHotelPage: vi.fn(),
  merchantHotelDelete: vi.fn(),
  merchantHotelSetStatus: vi.fn(),
}));

const hotelOn = {
  id: 1,
  name: '乌东苗寨木楼',
  address: '雷山县 · 乌东村一组',
  longitude: 108.1,
  latitude: 26.4,
  styleTags: ['苗寨'],
  facilityTags: ['WiFi'],
  mainImage: '/a.jpg',
  images: [],
  intro: '梯田木楼',
  rating: 4.8,
  reviewCount: 126,
  minPrice: 380,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '可携带小型宠物',
  hasBreakfast: 1,
  deposit: 100,
  status: 1,
  merchantId: 1,
};
const hotelOff = { ...hotelOn, id: 2, name: '已下架的院子', status: 0 };

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantHotelPage).mockReset().mockResolvedValue({
    list: [hotelOn, hotelOff],
    total: 2,
  });
  vi.mocked(merchantHotelDelete).mockReset().mockResolvedValue(true);
  vi.mocked(merchantHotelSetStatus).mockReset().mockResolvedValue(true);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/hotels', name: 'merchant-hotels', component: MerchantHotelListView },
      { path: '/merchant/hotels/new', name: 'merchant-hotel-new', component: { template: '<div>new</div>' } },
      { path: '/merchant/hotels/:id/edit', name: 'merchant-hotel-edit', component: { template: '<div>edit</div>' } },
      { path: '/merchant/hotels/:id/rooms', name: 'merchant-hotel-rooms', component: { template: '<div>rooms</div>' } },
    ],
  });
  await router.push('/merchant/hotels');
  await router.isReady();
  const wrapper = mount(MerchantHotelListView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantHotelListView', () => {
  it('加载并渲染我的民宿与状态', async () => {
    const { wrapper } = await mountView();
    expect(merchantHotelPage).toHaveBeenCalled();
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('已下架的院子');
    // 状态列必须真的渲染：只看 wrapper.text() 会被筛选框里的 <option>已下架</option> 满足而变成空断言
    expect(wrapper.findAll('tbody tr td:nth-child(3)').map((c) => c.text())).toEqual([
      '已上架',
      '已下架',
    ]);
  });

  it('无民宿时展示空态与新增引导', async () => {
    vi.mocked(merchantHotelPage).mockResolvedValue({ list: [], total: 0 });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('还没有民宿');
  });

  it('点击新增跳转到新建页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.find('.new-hotel').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels/new');
  });

  it('点击编辑进入编辑页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.findAll('.edit-hotel')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels/1/edit');
  });

  it('点击房型进入房型管理页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.findAll('.manage-rooms')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels/1/rooms');
  });

  it('下架：调用 setStatus 并刷新列表', async () => {
    vi.mocked(merchantHotelPage)
      .mockResolvedValueOnce({ list: [hotelOn, hotelOff], total: 2 })
      .mockResolvedValueOnce({
        list: [{ ...hotelOn, status: 0 }, hotelOff],
        total: 2,
      });
    const { wrapper } = await mountView();
    await wrapper.findAll('.toggle-status')[0].trigger('click');
    await flushPromises();
    expect(merchantHotelSetStatus).toHaveBeenCalledWith(1, 0);
    expect(merchantHotelPage).toHaveBeenCalledTimes(2);
  });

  it('上架：已下架民宿调用 setStatus(id, 1)', async () => {
    const { wrapper } = await mountView();
    await wrapper.findAll('.toggle-status')[1].trigger('click');
    await flushPromises();
    expect(merchantHotelSetStatus).toHaveBeenCalledWith(2, 1);
  });

  it('删除需二次确认，确认后调用删除并刷新', async () => {
    const { wrapper } = await mountView();
    await wrapper.findAll('.delete-hotel')[0].trigger('click');
    await flushPromises();

    expect(merchantHotelDelete).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('确认删除');

    await wrapper.find('.confirm-delete').trigger('click');
    await flushPromises();
    expect(merchantHotelDelete).toHaveBeenCalledWith(1);
    expect(merchantHotelPage).toHaveBeenCalledTimes(2);
  });

  it('双击确认删除只调用一次删除（第二次命中 无权操作该资源 会报假错）', async () => {
    let resolveDelete: (v: true) => void = () => {};
    vi.mocked(merchantHotelDelete).mockReturnValue(
      new Promise<true>((resolve) => {
        resolveDelete = resolve;
      })
    );
    const { wrapper } = await mountView();
    await wrapper.findAll('.delete-hotel')[0].trigger('click');
    await flushPromises();

    // 直接派发 click：绕开 :disabled 的 DOM 层拦截，才能验到函数内的 busy 守卫
    const confirm = wrapper.find('.confirm-delete').element as HTMLButtonElement;
    confirm.dispatchEvent(new Event('click'));
    confirm.dispatchEvent(new Event('click'));
    await flushPromises();

    expect(merchantHotelDelete).toHaveBeenCalledTimes(1);
    resolveDelete(true);
    await flushPromises();
  });

  it('删除失败展示后端 message（有房型时不可删）', async () => {
    vi.mocked(merchantHotelDelete).mockRejectedValue(
      new Error('请先删除该民宿下的房型')
    );
    const { wrapper } = await mountView();
    await wrapper.findAll('.delete-hotel')[0].trigger('click');
    await flushPromises();
    await wrapper.find('.confirm-delete').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('请先删除该民宿下的房型');
  });

  it('查询失败展示错误', async () => {
    vi.mocked(merchantHotelPage).mockRejectedValue(new Error('仅商家可访问'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('仅商家可访问');
    // 错误态与空态必须互斥：查询失败会把 list 清空，若分支链退回成同级 v-if，
    // 空态文案就会和错误一起冒出来——所以这里钉住它不得出现。
    expect(wrapper.text()).not.toContain('还没有民宿');
  });

  it('慢响应乱序返回：过期响应不覆盖较新的结果', async () => {
    let resolveSlow: (r: { list: typeof hotelOn[]; total: number }) => void = () => {};
    const slow = new Promise<{ list: typeof hotelOn[]; total: number }>((resolve) => {
      resolveSlow = resolve;
    });
    vi.mocked(merchantHotelPage)
      .mockReset()
      .mockReturnValueOnce(slow)
      .mockResolvedValueOnce({ list: [hotelOn], total: 1 });

    // 第 1 次请求（慢）挂在 pending；第 2 次请求先返回
    const { wrapper } = await mountView();
    await wrapper.find('.hotel-filters button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('乌东苗寨木楼');

    // 过期响应随后落地：不得覆盖第 2 次的结果
    resolveSlow({ list: [{ ...hotelOn, id: 99, name: '过期结果' }], total: 1 });
    await flushPromises();
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).not.toContain('过期结果');
  });
});
