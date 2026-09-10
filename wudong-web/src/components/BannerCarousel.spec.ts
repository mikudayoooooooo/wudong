import { describe, expect, it, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import BannerCarousel from './BannerCarousel.vue';

const banners = [
  { title: '苗寨金秋', image: '/a.jpg', linkType: 'page', linkValue: '/', position: 'home', sort: 1 },
  { title: '云海观星', image: '/b.jpg', linkType: 'page', linkValue: '/hotels', position: 'home', sort: 2 },
  { title: '梯田稻香', image: '/c.jpg', linkType: 'page', linkValue: '/hotels/1', position: 'home', sort: 3 }
];

describe('BannerCarousel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('渲染当前图标题与切换控件', () => {
    const w = mount(BannerCarousel, { props: { banners } });
    expect(w.text()).toContain('苗寨金秋');
    expect(w.findAll('.hero-arrow').length).toBeGreaterThanOrEqual(2);
    w.unmount();
  });
  it('自动轮播：每 4.5s 切换标题', async () => {
    vi.useFakeTimers();
    const w = mount(BannerCarousel, { props: { banners } });
    vi.advanceTimersByTime(4500);
    await nextTick();
    expect(w.text()).toContain('云海观星');
    vi.advanceTimersByTime(4500);
    await nextTick();
    expect(w.text()).toContain('梯田稻香');
    w.unmount();
  });
  it('手动点击 上一张/圆点 切换标题', async () => {
    const w = mount(BannerCarousel, { props: { banners } });
    const dots = w.findAll('.hero-dots button');
    expect(dots.length).toBe(3);
    await dots[2].trigger('click');
    expect(w.text()).toContain('梯田稻香');
    await w.find('.hero-arrow.prev').trigger('click');
    expect(w.text()).toContain('云海观星');
    w.unmount();
  });
});
