// Task 4 首页视图单测：注入 mock api（banners/announcements/searchHotels 返回常量），
// 断言轮播标题、公告、精选民宿与预订占位均已渲染；精选卡点击深链 /hotels/:id。
// HomeView 在 setup 顶部 useRouter()，故统一以真 router（memory history）挂载。
import { describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import HomeView from './HomeView.vue';

vi.mock('@/api/operate', () => ({
  banners: vi.fn().mockResolvedValue([{ title: '苗寨金秋', image: 'x.jpg', linkType: 'page', linkValue: '/', position: 'home', sort: 1 }]),
  announcements: vi.fn().mockResolvedValue([{ title: '公告', content: '欢迎来乌东', type: 1, isTop: 1 }])
}));
vi.mock('@/api/accommodation', () => ({
  searchHotels: vi.fn().mockResolvedValue([{ id: 1, name: '乌东苗寨木楼', address: '雷山', styleTags: ['苗寨'], facilityTags: [], mainImage: 'a.jpg', images: [], intro: '', rating: 4.8, reviewCount: 1, minPrice: 380, checkInTime: '14:00', checkOutTime: '12:00' }])
}));

/** 真 router（memory history，含 '/' 与深链 stub）后挂载首页 */
async function mountHome() {
  const stub = { template: '<div />' };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/hotels', name: 'hotels', component: stub },
      { path: '/hotels/:id', name: 'hotel-detail', component: stub },
    ],
  });
  await router.push('/');
  await router.isReady();
  const wrapper = mount(HomeView, { global: { plugins: [createPinia(), router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('HomeView', () => {
  it('渲染轮播标题、公告、精选民宿与预订占位', async () => {
    const { wrapper } = await mountHome();
    expect(wrapper.text()).toContain('苗寨金秋');
    expect(wrapper.text()).toContain('欢迎来乌东');
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('即将上线');
  });
  it('点击精选民宿卡深链到 /hotels/:id（不走通用列表页）', async () => {
    const { wrapper, router } = await mountHome();
    await wrapper.get('.hotel-card').trigger('click');
    await flushPromises(); // router.push 导航异步完成后再断言
    expect(router.currentRoute.value.path).toBe('/hotels/1');
  });
});
