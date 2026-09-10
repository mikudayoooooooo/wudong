// utils/date 纯日期工具单测：addDaysISO 跨月/跨年/闰年回绕、todayISO 格式、diffDays 差值、weekCN 下标。
import { describe, expect, it } from 'vitest';
import { addDaysISO, diffDays, todayISO, weekCN } from './date';

describe('utils/date', () => {
  it('todayISO 输出 YYYY-MM-DD 且与本地今天一致', () => {
    const s = todayISO();
    expect(s).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const now = new Date();
    const local = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    expect(s).toBe(local);
  });

  it('addDaysISO 跨月回绕', () => {
    expect(addDaysISO('2026-01-30', 2)).toBe('2026-02-01');
    expect(addDaysISO('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDaysISO('2026-02-28', 1)).toBe('2026-03-01'); // 2026 非闰年
    expect(addDaysISO('2026-03-31', -1)).toBe('2026-03-30');
  });

  it('addDaysISO 跨年回绕与负天数', () => {
    expect(addDaysISO('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysISO('2026-12-30', 2)).toBe('2027-01-01');
    expect(addDaysISO('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('addDaysISO 闰年 2 月正确回绕', () => {
    expect(addDaysISO('2028-02-28', 1)).toBe('2028-02-29'); // 2028 闰年
    expect(addDaysISO('2028-02-29', 1)).toBe('2028-03-01');
  });

  it('diffDays 返回 a-b 天数（含负值与跨年）', () => {
    expect(diffDays('2026-09-10', '2026-09-01')).toBe(9);
    expect(diffDays('2027-01-01', '2026-12-31')).toBe(1);
    expect(diffDays('2026-09-01', '2026-09-10')).toBe(-9);
    expect(diffDays('2026-09-10', '2026-09-10')).toBe(0);
  });

  it('weekCN 下标 0=日 … 6=六，共 7 项', () => {
    expect(weekCN).toEqual(['日', '一', '二', '三', '四', '五', '六']);
  });
});
