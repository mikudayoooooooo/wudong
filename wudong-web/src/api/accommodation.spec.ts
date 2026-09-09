import { describe, expect, it } from 'vitest';
import { mockHotels, roomTypesOf } from '../mocks';
describe('mocks 同构与归一', () => {
  it('hotel 字段满足类型（minPrice/rating 为数字）', () => {
    for (const h of mockHotels) {
      expect(typeof h.id).toBe('number');
      expect(typeof Number(h.minPrice)).toBe('number');
      expect(Number.isNaN(Number(h.minPrice))).toBe(false);
      expect(Array.isArray(h.styleTags)).toBe(true);
    }
  });
  it('roomTypesOf(hotelId) 归属一致', () => {
    const h = mockHotels[0];
    const rts = roomTypesOf(h.id);
    expect(rts.length).toBeGreaterThan(0);
    expect(rts.every((r) => r.hotelId === h.id)).toBe(true);
  });
});
