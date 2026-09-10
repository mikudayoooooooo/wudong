import { describe, expect, it } from 'vitest';
import { buildCalendar } from './calendar';
describe('buildCalendar', () => {
  it('跨度=end-start+1 天、date 升序、满库存为默认', () => {
    const rows = buildCalendar(1, 380, 3, '2026-09-01', '2026-09-10');
    expect(rows.length).toBe(10);
    expect(rows[0].date).toBe('2026-09-01');
    expect(rows[9].date).toBe('2026-09-10');
    // 常态：price=基础价、可订、满库
    expect(rows[1].price).toBe(380);
    expect(rows[1].availableStock).toBe(3);
    expect(rows[1].status).toBe(1);
  });
  it('含周六上浮与偶发满房/关房样本，且同日期不重复', () => {
    const rows = buildCalendar(1, 380, 3, '2026-09-01', '2026-09-30'); // 30 天样本
    const sat = rows.find((r) => new Date(r.date + 'T12:00:00').getDay() === 6);
    expect(sat && sat.price).toBeGreaterThan(380);
    expect(new Set(rows.map((r) => r.date)).size).toBe(rows.length);
    expect(rows.some((r) => r.availableStock === 0 || r.status === 0)).toBe(true);
  });
});
