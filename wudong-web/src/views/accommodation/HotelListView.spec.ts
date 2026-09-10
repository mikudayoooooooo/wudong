// Task 5 民宿列表页单测：mock api/accommodation.searchHotels（vi.mock key 用 @/ 别名）。
// 覆盖：URL 初始参数恢复 → 渲染卡片与条数；筛选 chip 点击 → searchHotels 新参数 + URL 同步；空列表 → 空态。
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import HotelListView from './HotelListView.vue';
import { searchHotels } from '@/api/accommodation';
import type { HotelQuery } from '@/api/types';

vi.mock('@/api/accommodation', () => ({
  searchHotels: vi.fn(),
}));

// Hotel 完整形态（含 petPolicy/hasBreakfast，与类型一致）
const hotelA = {
  id: 1,
  name: '乌东苗寨木楼',
  address: '雷山县 · 乌东村一组',
  styleTags: ['苗寨', '江景'],
  facilityTags: ['WiFi', '空调'],
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
};
const hotelB = {
  id: 2,
  name: '吊脚楼里看星空',
  address: '雷山县 · 乌东村二组',
  styleTags: ['苗寨', '观星'],
  facilityTags: ['WiFi'],
  mainImage: '/b.jpg',
  images: [],
  intro: '顶楼露台观星',
  rating: 4.6,
  reviewCount: 88,
  minPrice: 260,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '不可携带宠物',
  hasBreakfast: 0,
};

beforeEach(() => {
  // mock 搜索：按 keyword/styleTags 简单过滤，便于断言筛选后渲染
  vi.mocked(searchHotels).mockReset();
  vi.mocked(searchHotels).mockImplementation(async (q: HotelQuery = {}) => {
    const kw = (q.keyword || '').trim();
    return [hotelA, hotelB].filter(
      (h) =>
        (!kw || h.name.includes(kw)) &&
        (!q.styleTags || h.styleTags.includes(q.styleTags as string))
    );
  });
});

/** 用真 router（memory history）推到 /hotels 后挂载列表页 */
async function mountView(initQuery: Record<string, string> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/hotels', name: 'hotels', component: HotelListView }],
  });
  await router.push({ path: '/hotels', query: initQuery });
  await router.isReady();
  const wrapper = mount(HotelListView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('HotelListView', () => {
  it('挂载即搜索并渲染卡片与条数', async () => {
    const { wrapper } = await mountView();
    expect(searchHotels).toHaveBeenCalled();
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('吊脚楼里看星空');
    expect(wrapper.text()).toContain('2');
  });

  it('URL 初始参数（styleTags）恢复筛选并渲染对应民宿', async () => {
    const { wrapper } = await mountView({ styleTags: '观星' });
    expect(searchHotels).toHaveBeenCalledWith(expect.objectContaining({ styleTags: '观星' }));
    expect(wrapper.text()).toContain('吊脚楼里看星空');
    expect(wrapper.text()).not.toContain('乌东苗寨木楼');
  });

  it('筛选 chip 点击触发带新参数的 searchHotels 并同步 URL', async () => {
    const { wrapper, router } = await mountView();
    const chip = wrapper.findAll('.chip').find((c) => c.text().includes('苗寨'));
    expect(chip).toBeTruthy();
    await chip!.trigger('click');
    await flushPromises();
    expect(searchHotels).toHaveBeenLastCalledWith(expect.objectContaining({ styleTags: '苗寨' }));
    expect(router.currentRoute.value.query.styleTags).toBe('苗寨');
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('吊脚楼里看星空');
  });

  it('无匹配结果时展示空态', async () => {
    const { wrapper } = await mountView();
    const chip = wrapper.findAll('.chip').find((c) => c.text().includes('经济'));
    await chip!.trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('没有符合');
    expect(searchHotels).toHaveBeenLastCalledWith(expect.objectContaining({ styleTags: '经济' }));
  });
});
