import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantCalendarView from './MerchantCalendarView.vue';
import { merchantCalendarBatch, merchantCalendarRange, merchantRoomTypePage } from '@/api/merchant';
import { addDaysISO, todayISO } from '@/utils/date';

vi.mock('@/api/merchant', () => ({
  merchantRoomTypePage: vi.fn(),
  merchantCalendarRange: vi.fn(),
  merchantCalendarBatch: vi.fn(),
}));

const TODAY = todayISO();

const rowsFixture = [
  { date: TODAY, price: 380, availableStock: 3, status: 1 },
  { date: addDaysISO(TODAY, 1), price: 420, availableStock: 2, status: 0 },
];

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantRoomTypePage).mockReset().mockResolvedValue({
    list: [
      {
        id: 11,
        hotelId: 7,
        name: '苗寨大床房',
        bedType: '大床',
        area: 25,
        maxGuests: 2,
        facilities: [],
        price: 380,
        stock: 3,
        images: [],
        status: 1,
      },
    ],
    total: 1,
  });
  vi.mocked(merchantCalendarRange)
    .mockReset()
    .mockResolvedValue(rowsFixture);
  vi.mocked(merchantCalendarBatch).mockReset().mockResolvedValue({ count: 7 });
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/rooms/:id/calendar', name: 'merchant-room-calendar', component: MerchantCalendarView },
    ],
  });
  await router.push('/merchant/rooms/11/calendar');
  await router.isReady();
  const wrapper = mount(MerchantCalendarView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantCalendarView', () => {
  it('默认查询 7 天并渲染房态行', async () => {
    const { wrapper } = await mountView();
    expect(merchantCalendarRange).toHaveBeenCalledWith(
      11,
      TODAY,
      addDaysISO(TODAY, 6)
    );
    expect(wrapper.text()).toContain('苗寨大床房');
    expect(wrapper.text()).toContain('380.00');
    expect(wrapper.text()).toContain('可订');
    expect(wrapper.text()).toContain('已关房');
  });

  it('切换到 30 天后按新窗口重新查询', async () => {
    const { wrapper } = await mountView();
    const tab30 = wrapper.findAll('.range-tab').find((b) => b.text().includes('30'));
    await tab30!.trigger('click');
    await flushPromises();
    expect(merchantCalendarRange).toHaveBeenLastCalledWith(
      11,
      TODAY,
      addDaysISO(TODAY, 29)
    );
  });

  it('批量设置：提交价格与可售间数后刷新', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-price input').setValue('480');
    await wrapper.find('.batch-stock input').setValue('2');
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();

    expect(merchantCalendarBatch).toHaveBeenCalledWith(
      expect.objectContaining({
        roomTypeId: 11,
        startDate: TODAY,
        endDate: addDaysISO(TODAY, 6),
        price: 480,
        availableStock: 2,
      })
    );
    expect(merchantCalendarRange).toHaveBeenCalledTimes(2);
  });

  it('关房勾选后提交 closed=true', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-closed input[type="checkbox"]').setValue(true);
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(merchantCalendarBatch).toHaveBeenCalledWith(
      expect.objectContaining({ roomTypeId: 11, closed: true })
    );
  });

  it('既不填价格也不勾关房时提示且不提交', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(merchantCalendarBatch).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写价格或可售间数，或勾选关房');
  });

  it('按星期筛选：勾选周一后提交 weekDays=[1]', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-price input').setValue('500');
    const monday = wrapper
      .findAll('.weekday-toggle')
      .find((b) => b.text() === '一');
    await monday!.trigger('click');
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(merchantCalendarBatch).toHaveBeenCalledWith(
      expect.objectContaining({ weekDays: [1] })
    );
  });

  it('查询失败展示错误', async () => {
    vi.mocked(merchantCalendarRange).mockRejectedValue(new Error('无权操作该资源'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('无权操作该资源');
  });

  it('切窗慢响应乱序返回：过期响应不覆盖较新的结果', async () => {
    let resolveSlow: (r: typeof rowsFixture) => void = () => {};
    const slow = new Promise<typeof rowsFixture>((resolve) => {
      resolveSlow = resolve;
    });
    vi.mocked(merchantCalendarRange)
      .mockReset()
      .mockReturnValueOnce(slow)
      .mockResolvedValueOnce([
        { date: TODAY, price: 999, availableStock: 1, status: 1 },
      ]);

    // 第 1 次请求（onMounted 那次，慢）挂在 pending；切到 30 天触发的第 2 次先返回
    const { wrapper } = await mountView();
    const tab30 = wrapper.findAll('.range-tab').find((b) => b.text().includes('30'));
    await tab30!.trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('999.00');

    // 过期响应随后落地：不得覆盖第 2 次的结果
    resolveSlow([{ date: TODAY, price: 777, availableStock: 1, status: 1 }]);
    await flushPromises();
    expect(wrapper.text()).toContain('999.00');
    expect(wrapper.text()).not.toContain('777.00');
  });

  it('批量设置失败展示后端 message', async () => {
    vi.mocked(merchantCalendarBatch).mockRejectedValue(
      new Error('日期区间最多32天')
    );
    const { wrapper } = await mountView();
    await wrapper.find('.batch-price input').setValue('480');
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('日期区间最多32天');
  });
});
