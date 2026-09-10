// decimal 字段归一：后端 decimal 序列化后可能是 string（如 '480.00'），页面只消费 number。
import type {
  CalendarRow,
  Hotel,
  MerchantHotel,
  MerchantRoomType,
  RoomType,
} from './types';

/** 任意值 → number，不可解析时为 0 */
export const toNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

/** 任意值 → number，null/undefined 保持 null（minPrice 语义） */
export const toNumOrNull = (v: unknown): number | null =>
  v == null ? null : toNum(v);

/** 归一民宿（C 端） */
export const normHotel = (h: Hotel): Hotel => ({
  ...h,
  rating: toNum(h.rating),
  reviewCount: toNum(h.reviewCount),
  hasBreakfast: toNum(h.hasBreakfast),
  minPrice: toNumOrNull(h.minPrice),
});

/** 归一房型（C 端） */
export const normRoomType = (r: RoomType): RoomType => ({
  ...r,
  price: toNum(r.price),
  stock: toNum(r.stock),
  maxGuests: toNum(r.maxGuests),
});

/** 归一日历行 */
export const normRow = (r: CalendarRow): CalendarRow => ({
  ...r,
  price: toNum(r.price),
  availableStock: toNum(r.availableStock),
  status: toNum(r.status),
});

/** 归一民宿（商家视角，额外含经纬度/押金/状态） */
export const normMerchantHotel = (h: MerchantHotel): MerchantHotel => ({
  ...h,
  rating: toNum(h.rating),
  reviewCount: toNum(h.reviewCount),
  hasBreakfast: toNum(h.hasBreakfast),
  minPrice: toNumOrNull(h.minPrice),
  longitude: toNum(h.longitude),
  latitude: toNum(h.latitude),
  deposit: toNum(h.deposit),
  status: toNum(h.status),
});

/** 归一房型（商家视角，额外含设施/状态） */
export const normMerchantRoomType = (r: MerchantRoomType): MerchantRoomType => ({
  ...r,
  price: toNum(r.price),
  stock: toNum(r.stock),
  maxGuests: toNum(r.maxGuests),
  area: r.area == null ? null : toNum(r.area),
  status: toNum(r.status),
});
