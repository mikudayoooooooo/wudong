// Task 4 首页视图单测：注入 mock api（banners/announcements/searchHotels 返回常量），
// 断言轮播标题、公告、精选民宿与预订占位均已渲染。
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HomeView from './HomeView.vue';

vi.mock('@/api/operate', () => ({
  banners: vi.fn().mockResolvedValue([{ title: '苗寨金秋', image: 'x.jpg', linkType: 'page', linkValue: '/', position: 'home', sort: 1 }]),
  announcements: vi.fn().mockResolvedValue([{ title: '公告', content: '欢迎来乌东', type: 1, isTop: 1 }])
}));
vi.mock('@/api/accommodation', () => ({
  searchHotels: vi.fn().mockResolvedValue([{ id: 1, name: '乌东苗寨木楼', address: '雷山', styleTags: ['苗寨'], facilityTags: [], mainImage: 'a.jpg', images: [], intro: '', rating: 4.8, reviewCount: 1, minPrice: 380, checkInTime: '14:00', checkOutTime: '12:00' }])
}));

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('渲染轮播标题、公告、精选民宿与预订占位', async () => {
    const w = mount(HomeView, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.text()).toContain('苗寨金秋');
    expect(w.text()).toContain('欢迎来乌东');
    expect(w.text()).toContain('乌东苗寨木楼');
    expect(w.text()).toContain('即将上线');
  });
});
