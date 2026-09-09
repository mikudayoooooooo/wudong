import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import HotelCard from './HotelCard.vue';

const hotel = {
  id: 9,
  name: '乌东苗寨木楼',
  address: '雷山县西江镇',
  styleTags: ['苗寨', '山景'],
  facilityTags: [],
  mainImage: '/a.jpg',
  images: [],
  intro: '吊脚木楼，推窗见梯田。',
  rating: 4.8,
  reviewCount: 2,
  minPrice: 380,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '不可携带宠物',
  hasBreakfast: 1
};

describe('HotelCard', () => {
  it('渲染名称/地址/评分/起价', () => {
    const w = mount(HotelCard, { props: { hotel } });
    expect(w.text()).toContain('乌东苗寨木楼');
    expect(w.text()).toContain('雷山县西江镇');
    expect(w.text()).toContain('4.8');
    expect(w.text()).toContain('¥380.00/晚起');
  });
  it('点击整卡 emit click', async () => {
    const w = mount(HotelCard, { props: { hotel } });
    await w.trigger('click');
    expect(w.emitted('click')).toHaveLength(1);
  });
});
