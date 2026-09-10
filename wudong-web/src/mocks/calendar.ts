// 房态日历 mock 工厂：按日生成，与后端 /app/accommodation/room-type/calendar 返回同构。
// 演示规则（遵循 brief/plan）：
//  - 逐日生成 start..end（含首尾），date 升序；
//  - 周六价格上浮 basePrice+80、周日 +40；
//  - 第 n 天 n%9===0 满房 availableStock=0（仍可订态已满）；
//  - 第 n 天 n%23===0 关房 status=0（不可订，库存清 0）；
//  - 其余为常态：price=basePrice、availableStock=stock、status=1。
import type { CalendarRow } from '../api/types';

const pad = (n: number): string => String(n).padStart(2, '0');

const toISO = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const buildCalendar = (
  _roomTypeId: number,
  basePrice: number,
  stock: number,
  startISO: string,
  endISO: string
): CalendarRow[] => {
  const start = new Date(`${startISO}T12:00:00`);
  const end = new Date(`${endISO}T12:00:00`);
  const rows: CalendarRow[] = [];
  let cursor = start;
  let n = 0;
  while (cursor <= end) {
    n += 1; // 第 n 天（1-based）
    const week = cursor.getDay();
    // 周六 +80 / 周日 +40（周末上浮演示）
    const bonus = week === 6 ? 80 : week === 0 ? 40 : 0;
    const price = Number(basePrice) + bonus;
    let availableStock = stock;
    let status = 1;
    if (n % 23 === 0) {
      // 偶发关房：不可订
      status = 0;
      availableStock = 0;
    } else if (n % 9 === 0) {
      // 偶发满房：仍可订态（status 1）但库存 0
      availableStock = 0;
    }
    rows.push({ date: toISO(cursor), price, availableStock, status });
    const next = new Date(cursor);
    next.setDate(next.getDate() + 1);
    cursor = next;
  }
  return rows;
};
