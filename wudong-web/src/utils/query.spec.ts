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
  it('parse 丢弃纯空格 keyword，首尾空格 trim 后归一', () => {
    expect(parseHotelQuery('?keyword=%20%20&sort=rating')).toEqual({ sort: 'rating' });
    expect(parseHotelQuery('?keyword=%20%E8%8B%97%E5%AF%A8%20')).toEqual({ keyword: '苗寨' });
  });
  it('toQueryString 不输出纯空格 keyword，写侧同样 trim', () => {
    expect(toQueryString({ keyword: '   ', rating: 4.5 })).toBe('rating=4.5');
    expect(toQueryString({ keyword: '  苗寨  ' })).toBe('keyword=%E8%8B%97%E5%AF%A8');
  });
});
