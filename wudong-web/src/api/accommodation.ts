// 住宿浏览数据层：真实后端(8001) 与 mocks 同构数据间选择（唯一判据 USE_MOCK）。
// mock 与 real 的返回结构都过同一归一（minPrice/rating/price Number()），页面只消费归一后类型。
import { USE_MOCK } from '../env';
import { request } from './http';
import { normHotel, normRoomType, normRow, toNum } from './normalize';
import type { CalendarRow, Hotel, HotelDetail, HotelQuery, RoomType } from './types';
import {
  hotelById,
  mockHotels,
  mockRoomTypeById,
  roomTypesOf,
} from '../mocks';
import { buildCalendar } from '../mocks/calendar';

/** mock 搜索实现：keyword/styleTags/rating 过滤 + sort 排序 + 分页（与后端语义一致） */
const mockSearchHotels = (q: HotelQuery): Hotel[] => {
  let rows = mockHotels.slice();
  const kw = (q.keyword || '').trim();
  if (kw) {
    rows = rows.filter((h) => h.name.includes(kw) || h.address.includes(kw));
  }
  if (q.styleTags) {
    rows = rows.filter((h) => (h.styleTags || []).includes(q.styleTags as string));
  }
  if (q.rating != null) {
    rows = rows.filter((h) => h.rating >= Number(q.rating));
  }
  if (q.sort === 'rating') rows = rows.sort((a, b) => b.rating - a.rating);
  else if (q.sort === 'price') rows = rows.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0));
  else if (q.sort === 'priceDesc') rows = rows.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
  const pageNo = Math.max(Number(q.page) || 1, 1);
  const pageSize = Math.max(Number(q.size) || 20, 1);
  return rows.slice((pageNo - 1) * pageSize, pageNo * pageSize).map(normHotel);
};

/** 搜索民宿：按关键字/风格/评分/排序，返回启用房型最低起价（minPrice，可 null） */
export const searchHotels = async (q: HotelQuery = {}): Promise<Hotel[]> => {
  if (USE_MOCK) return mockSearchHotels(q);
  const d = await request<{ list: Hotel[]; total: number }>(
    '/app/accommodation/hotel/search',
    { ...q, page: q.page ?? 1, size: q.size ?? 20 }
  );
  return (d.list || []).map(normHotel);
};

/** 民宿详情（基本信息 + 启用房型） */
export const hotelDetail = async (id: number): Promise<HotelDetail> => {
  if (USE_MOCK) {
    const info = hotelById(id);
    if (!info) throw new Error('民宿不存在或已下架');
    return { info: normHotel(info), roomTypes: roomTypesOf(id).map(normRoomType) };
  }
  const d = await request<{ info: Hotel; roomTypes: RoomType[] }>(
    '/app/accommodation/hotel/detail',
    { id }
  );
  return {
    info: normHotel(d.info),
    roomTypes: (d.roomTypes || []).map(normRoomType),
  };
};

/** 房态日历：按房型查 start..end 逐日房态 */
export const roomCalendar = async (
  roomTypeId: number,
  start: string,
  end: string
): Promise<CalendarRow[]> => {
  if (USE_MOCK) {
    const rt = mockRoomTypeById(roomTypeId);
    const base = rt ? toNum(rt.price) : 380;
    const stock = rt ? toNum(rt.stock) : 3;
    return buildCalendar(roomTypeId, base, stock, start, end).map(normRow);
  }
  const rows = await request<CalendarRow[]>('/app/accommodation/room-type/calendar', {
    roomTypeId,
    startDate: start,
    endDate: end,
  });
  return (rows || []).map(normRow);
};
