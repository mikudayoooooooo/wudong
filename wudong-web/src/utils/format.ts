// 展示格式化纯函数（可单测）。金额统一两位小数，全站一致（RoomCard/CalendarTable/HotelCard 共用，
// 避免同页混排 ¥380 与 ¥380.00）。
/** 金额展示：380 → '380.00'，380.5 → '380.50'；null/undefined → ''（调用方自行兜底如 '--'） */
export function fmtPrice(v: number | null | undefined): string {
  if (v == null) return '';
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : '';
}
