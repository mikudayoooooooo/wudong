// Task 6 民宿详情页 + 房态日历面板 单测（含日历交互）。
// mock api/accommodation（vi.mock key 用 @/ 别名，Task 4/5 教训）；
// 用真 router（memory history）推到 /hotels/9 注入 params.id，再挂载视图——最贴近真实。
// 覆盖：详情名/两房型渲染、预订禁用+即将上线、返回列表、点「查看房态」拉 30 天日历并渲染表格、
//       ?range=7 起按 7 天拉取、7/30 头按钮切换写回 ?range 并重拉、外部改 URL(前进后退) 重拉、
//       日历空态、详情/房态失败态可重试。
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import HotelDetailView from './HotelDetailView.vue';
import { addDaysISO, todayISO } from '@/utils/date';
import { hotelDetail, roomCalendar } from '@/api/accommodation';
import type { Hotel, RoomType, CalendarRow } from '@/api/types';

vi.mock('@/api/accommodation', () => ({
  hotelDetail: vi.fn(),
  roomCalendar: vi.fn(),
}));

const info: Hotel = {
  id: 9,
  name: '乌东苗寨木楼',
  address: '雷山县 · 乌东村一组',
  styleTags: ['苗寨'],
  facilityTags: ['WiFi'],
  mainImage: '/a.jpg',
  images: ['/a.jpg'],
  intro: '梯田之上的百年木楼。',
  rating: 4.8,
  reviewCount: 2,
  minPrice: null, // 真实 /detail 无 minPrice（恒 null）——详情页按房型展示价格，不依赖它
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '可携带小型宠物',
  hasBreakfast: 1,
};
const roomA: RoomType = { id: 1, hotelId: 9, name: '苗族木屋大床房', bedType: '大床', maxGuests: 2, price: 380, stock: 3 };
const roomB: RoomType = { id: 2, hotelId: 9, name: '吊脚楼双床房', bedType: '双床', maxGuests: 2, price: 520, stock: 2 };
const rows: CalendarRow[] = [
  { date: '2026-09-10', price: 380, availableStock: 2, status: 1 },
  { date: '2026-09-11', price: 520, availableStock: 0, status: 1 },
];

beforeEach(() => {
  vi.mocked(hotelDetail).mockReset();
  vi.mocked(roomCalendar).mockReset();
  vi.mocked(hotelDetail).mockResolvedValue({ info, roomTypes: [roomA, roomB] });
  vi.mocked(roomCalendar).mockResolvedValue(rows);
});

/** 真 router（memory history）推到 /hotels/9 后挂载详情视图 */
async function mountView(query: Record<string, string> = {}) {
  // 需同时注册 /hotels（返回列表的目标路由）与 /hotels/:id，否则 push 无匹配被中止
  const stub = { template: '<div />' };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/hotels', component: stub },
      { path: '/hotels/:id', name: 'hotel-detail', component: HotelDetailView },
    ],
  });
  await router.push({ path: '/hotels/9', query });
  await router.isReady();
  const wrapper = mount(HotelDetailView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

/** 第 idx 张房型卡里的「查看房态日历」按钮 */
function viewCalendarBtn(wrapper: ReturnType<typeof mount>, idx: number) {
  const card = wrapper.findAll('.room-card')[idx];
  const btn = card.findAll('button').find((b) => b.text().includes('查看房态日历'));
  if (!btn) throw new Error('未找到 查看房态日历 按钮');
  return btn;
}

describe('HotelDetailView', () => {
  it('渲染民宿名与两房型，预订禁用且含即将上线；返回列表按钮回 /hotels', async () => {
    const { wrapper } = await mountView();
    expect(hotelDetail).toHaveBeenCalledWith(9);
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('苗族木屋大床房');
    expect(wrapper.text()).toContain('吊脚楼双床房');
    expect(wrapper.findAll('.room-card').length).toBe(2);
    // 预订按钮 disabled + 即将上线占位
    const bookBtn = wrapper.get('.room-card .btn-primary');
    expect((bookBtn.element as HTMLButtonElement).disabled).toBe(true);
    expect(wrapper.text()).toContain('即将上线');
  });

  it('返回列表按钮点击 router 跳回 /hotels', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.get('.back-btn').trigger('click');
    await flushPromises(); // router.push 导航异步完成后再断言
    expect(router.currentRoute.value.path).toBe('/hotels');
  });

  it('点房型「查看房态」→ 拉 30 天日历并渲染价格/日期/可订状态', async () => {
    const { wrapper } = await mountView();
    expect(roomCalendar).not.toHaveBeenCalled(); // 未选房型前不请求
    await viewCalendarBtn(wrapper, 0).trigger('click');
    await flushPromises();
    const today = todayISO();
    expect(roomCalendar).toHaveBeenCalledTimes(1);
    expect(roomCalendar).toHaveBeenCalledWith(1, today, addDaysISO(today, 29));
    const table = wrapper.get('.calendar-table');
    expect(table.text()).toContain('¥380.00');
    expect(table.text()).toContain('¥520.00');
    expect(table.text()).toContain('9月10日');
    expect(table.text()).toContain('9月11日');
    expect(table.text()).toContain('剩 2 间');
    expect(table.text()).toContain('已满');
  });

  it('?range=7 起按 7 天拉取；头按钮切 30 天写回 ?range=30 并重拉 end=today+29', async () => {
    const { wrapper, router } = await mountView({ range: '7' });
    await viewCalendarBtn(wrapper, 0).trigger('click');
    await flushPromises();
    const today = todayISO();
    expect(roomCalendar).toHaveBeenLastCalledWith(1, today, addDaysISO(today, 6));
    // 切换 30 天 → router.replace 写回 ?range=30 → 重新 fetch，end=today+29，且 30 天 chip 高亮
    const chip30 = wrapper.findAll('.chip').find((c) => c.text().includes('30 天'))!;
    await chip30.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.query.range).toBe('30'); // URL 可分享：档位进入地址栏
    expect(roomCalendar).toHaveBeenLastCalledWith(1, today, addDaysISO(today, 29));
    expect(chip30.classes()).toContain('on');
  });

  it('外部改 URL（历史前进后退）→ watch 归一 range 并按新档重拉', async () => {
    const { wrapper, router } = await mountView(); // 默认 30
    await viewCalendarBtn(wrapper, 0).trigger('click');
    await flushPromises();
    const today = todayISO();
    expect(roomCalendar).toHaveBeenLastCalledWith(1, today, addDaysISO(today, 29));
    // 前进/后退等外部导航把 ?range 改为 7 → watch 触发，档位 7 并重拉 7 天
    await router.replace({ path: '/hotels/9', query: { range: '7' } });
    await flushPromises();
    expect(roomCalendar).toHaveBeenLastCalledWith(1, today, addDaysISO(today, 6));
    expect(wrapper.findAll('.chip').find((c) => c.text().includes('7 天'))!.classes()).toContain('on');
  });

  it('日历接口返回空 → 日历表空态文案', async () => {
    vi.mocked(roomCalendar).mockResolvedValue([]);
    const { wrapper } = await mountView();
    await viewCalendarBtn(wrapper, 0).trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('暂无房态');
  });

  it('详情加载失败展示错误态，点重新加载恢复', async () => {
    vi.mocked(hotelDetail).mockRejectedValueOnce(new Error('boom'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('加载失败');
    vi.mocked(hotelDetail).mockResolvedValue({ info, roomTypes: [roomA] });
    await wrapper.get('.retry').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.findAll('.room-card').length).toBe(1);
  });

  it('房态加载失败展示错误态，点重新加载恢复表格', async () => {
    vi.mocked(roomCalendar).mockRejectedValueOnce(new Error('calendar down'));
    const { wrapper } = await mountView();
    await viewCalendarBtn(wrapper, 0).trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('房态加载失败');
    await wrapper.get('.retry').trigger('click');
    await flushPromises();
    expect(wrapper.get('.calendar-table').text()).toContain('¥380.00');
  });
});
