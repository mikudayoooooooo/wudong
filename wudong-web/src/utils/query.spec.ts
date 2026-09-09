import { describe, expect, it } from 'vitest';
import { parseHotelQuery, toQueryString } from './query';
describe('query 序列化', () => {
  it('parse 返回归一对象', () => {
    expect(parseHotelQuery('?keyword=%E8%8B%97&style=苗寨&rating=4.5&sort=price')).toEqual({
      keyword: '苗',
      styleTags: '苗寨',
      rating: 4.5,
      sort: 'price',
    });
  });
  it('toQueryString 忽略空值并编码', () => {
    expect(
      toQueryString({ keyword: '', styleTags: '苗 寨', rating: undefined, sort: 'rating' })
    ).toBe('styleTags=%E8%8B%97%20%E5%AF%A8&sort=rating');
  });
});
