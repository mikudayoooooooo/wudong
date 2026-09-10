import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarTable from './CalendarTable.vue';

const rows = [
  { date: '2026-09-10', price: 380, availableStock: 2, status: 1 },
  { date: '2026-09-11', price: 380, availableStock: 0, status: 1 },
  { date: '2026-09-12', price: 380, availableStock: 2, status: 0 }
];

describe('CalendarTable', () => {
  it('渲染 可订/已满/不可订 三态与价格', () => {
    const w = mount(CalendarTable, { props: { rows, loading: false } });
    expect(w.text()).toContain('剩 2 间');
    expect(w.text()).toContain('已满');
    expect(w.text()).toContain('不可订');
    expect(w.text()).toContain('¥380.00');
  });
  it('空态显示文案', () => {
    const w = mount(CalendarTable, { props: { rows: [], loading: false } });
    expect(w.text()).toContain('暂无');
  });
});
