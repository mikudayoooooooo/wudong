import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantRoomTypeView from './MerchantRoomTypeView.vue';
import {
  merchantHotelInfo,
  merchantRoomTypeDelete,
  merchantRoomTypePage,
  merchantRoomTypeSave,
} from '@/api/merchant';

vi.mock('@/api/merchant', () => ({
  merchantHotelInfo: vi.fn(),
  merchantRoomTypePage: vi.fn(),
  merchantRoomTypeSave: vi.fn(),
  merchantRoomTypeDelete: vi.fn(),
}));

const roomTypeFixture = {
  id: 11,
  hotelId: 7,
  name: '苗寨大床房',
  bedType: '大床',
  area: 25,
  maxGuests: 2,
  facilities: ['WiFi'],
  price: 380,
  stock: 3,
  images: [],
  status: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantHotelInfo).mockReset().mockResolvedValue({
    id: 7,
    name: '乌东苗寨木楼',
    address: '雷山县',
    merchantId: 1,
    status: 1,
  } as any);
  vi.mocked(merchantRoomTypePage)
    .mockReset()
    .mockResolvedValue({ list: [roomTypeFixture], total: 1 });
  vi.mocked(merchantRoomTypeSave)
    .mockReset()
    .mockResolvedValue({ ...roomTypeFixture, id: 12 });
  vi.mocked(merchantRoomTypeDelete).mockReset().mockResolvedValue(true);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/hotels/:id/rooms', name: 'merchant-hotel-rooms', component: MerchantRoomTypeView },
      { path: '/merchant/rooms/:id/calendar', name: 'merchant-room-calendar', component: { template: '<div>calendar</div>' } },
    ],
  });
  await router.push('/merchant/hotels/7/rooms');
  await router.isReady();
  const wrapper = mount(MerchantRoomTypeView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantRoomTypeView', () => {
  it('加载民宿名与房型列表', async () => {
    const { wrapper } = await mountView();
    expect(merchantRoomTypePage).toHaveBeenCalledWith(7);
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('苗寨大床房');
    expect(wrapper.text()).toContain('380');
  });

  it('点新增打开空表单', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    expect(wrapper.find('.room-type-form').exists()).toBe(true);
    expect(
      (wrapper.find('.field-room-name input').element as HTMLInputElement).value
    ).toBe('');
  });

  it('新增保存后刷新列表并关闭表单', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('双床房');
    await wrapper.find('.field-room-price input').setValue('520');
    await wrapper.find('.field-room-stock input').setValue('2');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();

    expect(merchantRoomTypeSave).toHaveBeenCalledWith(
      expect.objectContaining({ hotelId: 7, name: '双床房', price: 520, stock: 2 })
    );
    expect(merchantRoomTypePage).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.room-type-form').exists()).toBe(false);
  });

  it('价格为空或 0 时提示且不提交', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('免费房');
    await wrapper.find('.field-room-price input').setValue('0');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();
    expect(merchantRoomTypeSave).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('房型价格必须大于 0');
  });

  it('点编辑预填该房型', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.edit-room-type').trigger('click');
    expect(
      (wrapper.find('.field-room-name input').element as HTMLInputElement).value
    ).toBe('苗寨大床房');
    expect(
      (wrapper.find('.field-room-stock input').element as HTMLInputElement).value
    ).toBe('3');
  });

  it('点房态跳转日历页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.find('.manage-calendar').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/rooms/11/calendar');
  });

  it('删除需二次确认，确认后调用删除并刷新', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.delete-room-type').trigger('click');
    await flushPromises();
    expect(merchantRoomTypeDelete).not.toHaveBeenCalled();
    await wrapper.find('.confirm-delete-room').trigger('click');
    await flushPromises();
    expect(merchantRoomTypeDelete).toHaveBeenCalledWith(11);
    expect(merchantRoomTypePage).toHaveBeenCalledTimes(2);
  });

  it('列表为空时展示空态', async () => {
    vi.mocked(merchantRoomTypePage).mockResolvedValue({ list: [], total: 0 });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('还没有房型');
  });

  it('保存失败展示后端 message', async () => {
    vi.mocked(merchantRoomTypeSave).mockRejectedValue(
      new Error('房间数量至少为 1')
    );
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('双床房');
    await wrapper.find('.field-room-price input').setValue('520');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('房间数量至少为 1');
  });

  it('加载失败展示后端 message，且不与空态同屏', async () => {
    vi.mocked(merchantRoomTypePage).mockRejectedValue(new Error('仅商家可访问'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('仅商家可访问');
    // 失败时 list 也被清空；若空态与错误同级（两条 v-if 而非互斥链），空态文案会一起冒出来
    expect(wrapper.text()).not.toContain('还没有房型');
  });

  it('慢响应乱序返回：过期响应不覆盖较新的结果', async () => {
    let resolveSlow: (r: { list: typeof roomTypeFixture[]; total: number }) => void = () => {};
    const slow = new Promise<{ list: typeof roomTypeFixture[]; total: number }>((resolve) => {
      resolveSlow = resolve;
    });
    vi.mocked(merchantRoomTypePage)
      .mockReset()
      .mockReturnValueOnce(slow)
      .mockResolvedValueOnce({ list: [roomTypeFixture], total: 1 });

    // 第 1 次请求（onMounted 那次，慢）挂在 pending；保存后触发的第 2 次先返回
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('双床房');
    await wrapper.find('.field-room-price input').setValue('520');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('苗寨大床房');

    // 过期响应随后落地：不得覆盖第 2 次的结果
    resolveSlow({ list: [{ ...roomTypeFixture, id: 99, name: '过期房型' }], total: 1 });
    await flushPromises();
    expect(wrapper.text()).toContain('苗寨大床房');
    expect(wrapper.text()).not.toContain('过期房型');
  });
});
