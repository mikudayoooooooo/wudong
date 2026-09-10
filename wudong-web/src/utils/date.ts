// 纯日期工具（本地时区 YYYY-MM-DD 日历运算，C 端房态日历/日期参数统一入口）。
// 语义基准：日期解析统一取当日「本地正午」YYYY-MM-DDT12:00:00，setDate 按本地日历日加减，
// 输出取回本地年月日 —— 与后端房态日历 start/end 日期参数同构，并规避 toISOString() 的 UTC 偏移。
const pad2 = (n: number): string => String(n).padStart(2, '0');
const toISO = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** 今天（本地时区）→ 'YYYY-MM-DD' */
export const todayISO = (): string => toISO(new Date());

/** 'YYYY-MM-DD' 加 n 天（n 可为负），返回 'YYYY-MM-DD'；跨月/跨年/闰年正确回绕 */
export const addDaysISO = (iso: string, n: number): string => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

/** 两日期相差天数 = a - b（同日正午毫秒差 / 86400000，四舍五入，跨夏令时仍稳定） */
export const diffDays = (a: string, b: string): number => {
  const msA = new Date(`${a}T12:00:00`).getTime();
  const msB = new Date(`${b}T12:00:00`).getTime();
  return Math.round((msA - msB) / 86400000);
};

/** 中文星期短名：下标与 Date#getDay() 一致，0=日 … 6=六 */
export const weekCN: string[] = ['日', '一', '二', '三', '四', '五', '六'];
