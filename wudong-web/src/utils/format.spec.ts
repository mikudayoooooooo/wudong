import { describe, expect, it } from 'vitest';
import { fmtPrice } from './format';
describe('fmtPrice 金额展示统一', () => {
  it('整数与小数都统一两位小数', () => {
    expect(fmtPrice(380)).toBe('380.00');
    expect(fmtPrice(380.5)).toBe('380.50');
    expect(fmtPrice(0)).toBe('0.00');
  });
  it('null/undefined → 空串（无价兜底由调用方承担，如 --）', () => {
    expect(fmtPrice(null)).toBe('');
    expect(fmtPrice(undefined)).toBe('');
  });
});
