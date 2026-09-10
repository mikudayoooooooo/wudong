// 民宿列表 URL 筛选的序列化/反序列化（纯函数，可单测）。
// 语义：toQueryString 只序列化 keyword/styleTags/rating/sort 四段 URL 同步字段（HotelQuery 的
// 筛选子集，page/size 不入 URL），忽略空值，encodeURIComponent；parseHotelQuery 与之互逆：
// 风格字段同时接受本模块写出的 'styleTags' 与（历史/简写）'style' 两种参数键。
// 两者都只返回带值的字段，返回对象的键顺序固定（keyword → styleTags → rating → sort）。
import type { HotelQuery } from '@/api/types';

const parseValues = (search: string): URLSearchParams =>
  new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

/** 依次取多个候选键中第一个非空值；全部缺失/为空返回 '' */
function firstOf(params: URLSearchParams, keys: string[]): string {
  for (const k of keys) {
    const v = params.get(k);
    if (v != null && v !== '') return v;
  }
  return '';
}

/** URL search 字符串（可带或不带前导 ?）→ 归一筛选对象（rating 为 number，空字段省略） */
export function parseHotelQuery(search: string): HotelQuery {
  const params = parseValues(search);
  const q: HotelQuery = {};

  // keyword trim：纯空格/首尾空格归一后丢弃（与 mock/real 后端一致，避免 %20 泄漏与字面空格空结果）
  const keyword = firstOf(params, ['keyword']).trim();
  if (keyword) q.keyword = keyword;

  const styleTags = firstOf(params, ['styleTags', 'style']);
  if (styleTags) q.styleTags = styleTags;

  const ratingRaw = firstOf(params, ['rating']);
  if (ratingRaw !== '') {
    const rating = Number(ratingRaw);
    if (!Number.isNaN(rating)) q.rating = rating;
  }

  const sort = firstOf(params, ['sort']);
  if (sort) q.sort = sort;

  return q;
}

/** 筛选对象 → query string（无前导 ?，只含非空字段，encodeURIComponent） */
export function toQueryString(q: HotelQuery): string {
  const parts: string[] = [];
  const push = (key: string, value: string): void => {
    parts.push(`${key}=${encodeURIComponent(value)}`);
  };

  // keyword trim：纯空格绝不入 URL；首尾空格在写侧归一（与 parseHotelQuery 互逆，URL 保持干净可分享）
  const keyword = q.keyword?.trim();
  if (keyword) push('keyword', keyword);
  if (q.styleTags) push('styleTags', q.styleTags);
  if (q.rating != null) push('rating', String(q.rating));
  if (q.sort) push('sort', q.sort);

  return parts.join('&');
}
