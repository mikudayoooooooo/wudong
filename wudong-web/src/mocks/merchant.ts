// 商家区演示数据：内存态，增删改在本次会话内生效（刷新页面即重置）。
// 结构与后端返回同构；api/merchant.ts 负责在 USE_MOCK 时选它，视图层不感知。
import type {
  CalendarRow,
  MerchantApplication,
  MerchantHotel,
  MerchantInfo,
  MerchantRoomType,
  MemberInfo,
  PageResult,
} from '../api/types';
import { mockHotels, mockRoomTypes } from './index';
import { buildCalendar } from './calendar';

/** mock 模式下已登录的会员（商家身份） */
export const mockMemberInfo: MemberInfo = {
  id: 1,
  phone: '13300133001',
  nickname: '演示商家',
  role: 2,
};

/** mock 模式下已入驻的店铺 */
export const mockMerchantInfo: MerchantInfo = {
  id: 1,
  userId: 1,
  username: 'm1',
  shopName: '乌东苗寨木楼',
  module: 'accommodation',
  contactName: '杨阿妹',
  contactPhone: '13300133001',
  status: 1,
  joinedAt: '2026-09-01 10:00:00',
};

export const mockLogin = (phone: string): { token: string } => ({
  token: `mock-token-${phone}`,
});

export const mockSendSmsCode = (_phone: string): { code: string } => ({
  code: '123456',
});

/** 演示身份已入驻，因此没有进行中的申请（首页直接展示店铺） */
export const mockMerchantApplication = (): MerchantApplication | null => null;

export const mockMerchantApply = (): true => true;

export const mockMerchantMy = (): MerchantInfo | null => mockMerchantInfo;

// ---- 内存态数据 ----

const seedHotels = (): MerchantHotel[] =>
  mockHotels.map((h, i) => ({
    ...h,
    merchantId: 1,
    longitude: 108.1 + i * 0.01,
    latitude: 26.4 + i * 0.01,
    deposit: 100,
    status: 1,
  }));

const seedRoomTypes = (): MerchantRoomType[] =>
  mockRoomTypes.map((r) => ({
    ...r,
    facilities: ['WiFi', '空调'],
    status: 1,
  }));

let hotels: MerchantHotel[] = seedHotels();
let roomTypes: MerchantRoomType[] = seedRoomTypes();
/** 房态覆盖：key = `${roomTypeId}|${date}` */
const overrides: Record<string, CalendarRow> = {};
let nextId = 1000;

/** 仅测试用：把内存态恢复为初始种子 */
export const resetMerchantMocks = (): void => {
  hotels = seedHotels();
  roomTypes = seedRoomTypes();
  for (const key of Object.keys(overrides)) delete overrides[key];
  nextId = 1000;
};

export const mockHotelPage = (q: {
  page?: number;
  size?: number;
  name?: string;
  status?: number;
} = {}): PageResult<MerchantHotel> => {
  let rows = hotels.slice();
  const name = (q.name ?? '').trim();
  if (name) rows = rows.filter((h) => h.name.includes(name));
  if (q.status != null) rows = rows.filter((h) => h.status === Number(q.status));
  const page = Math.max(Number(q.page) || 1, 1);
  const size = Math.max(Number(q.size) || 10, 1);
  return {
    list: rows.slice((page - 1) * size, page * size),
    total: rows.length,
  };
};

export const mockHotelInfo = (id: number): MerchantHotel | null =>
  hotels.find((h) => h.id === Number(id)) ?? null;

export const mockHotelSave = (form: MerchantHotel): MerchantHotel => {
  if (form.id) {
    const index = hotels.findIndex((h) => h.id === Number(form.id));
    if (index < 0) throw new Error('无权操作该资源');
    hotels[index] = { ...hotels[index], ...form };
    return hotels[index];
  }
  const created: MerchantHotel = {
    ...form,
    id: ++nextId,
    merchantId: 1,
    rating: 5,
    reviewCount: 0,
    minPrice: null,
  };
  hotels = [created, ...hotels];
  return created;
};

export const mockHotelDelete = (id: number): true => {
  if (roomTypes.some((r) => r.hotelId === Number(id))) {
    throw new Error('请先删除该民宿下的房型');
  }
  hotels = hotels.filter((h) => h.id !== Number(id));
  return true;
};

export const mockHotelSetStatus = (id: number, status: number): true => {
  const index = hotels.findIndex((h) => h.id === Number(id));
  if (index < 0) throw new Error('无权操作该资源');
  hotels[index] = { ...hotels[index], status: Number(status) };
  return true;
};

export const mockRoomTypePage = (hotelId: number): PageResult<MerchantRoomType> => {
  const list = roomTypes.filter((r) => r.hotelId === Number(hotelId));
  return { list, total: list.length };
};

export const mockRoomTypeSave = (form: MerchantRoomType): MerchantRoomType => {
  if (form.id) {
    const index = roomTypes.findIndex((r) => r.id === Number(form.id));
    if (index < 0) throw new Error('无权操作该资源');
    roomTypes[index] = { ...roomTypes[index], ...form };
    return roomTypes[index];
  }
  const created: MerchantRoomType = { ...form, id: ++nextId };
  roomTypes = [...roomTypes, created];
  return created;
};

export const mockRoomTypeDelete = (id: number): true => {
  roomTypes = roomTypes.filter((r) => r.id !== Number(id));
  for (const key of Object.keys(overrides)) {
    if (key.startsWith(`${id}|`)) delete overrides[key];
  }
  return true;
};

/** 区间房态：无覆盖的日期回退房型基础价/库存（与后端语义一致） */
export const mockCalendarRange = (
  roomTypeId: number,
  start: string,
  end: string
): CalendarRow[] => {
  const roomType = roomTypes.find((r) => r.id === Number(roomTypeId));
  if (!roomType) throw new Error('无权操作该资源');
  return buildCalendar(roomTypeId, roomType.price, roomType.stock, start, end).map(
    (row) => overrides[`${roomTypeId}|${row.date}`] ?? row
  );
};

/** 批量设置：区间内逐日写覆盖，可按星期筛选；availableStock 截断到房型 stock */
export const mockCalendarBatch = (form: {
  roomTypeId: number;
  startDate: string;
  endDate: string;
  weekDays?: number[];
  price?: number;
  availableStock?: number;
  closed?: boolean;
}): { count: number } => {
  const roomType = roomTypes.find((r) => r.id === Number(form.roomTypeId));
  if (!roomType) throw new Error('无权操作该资源');
  const dates = buildCalendar(
    form.roomTypeId,
    roomType.price,
    roomType.stock,
    form.startDate,
    form.endDate
  ).map((r) => r.date);
  const week = (form.weekDays ?? []).map(Number);

  let count = 0;
  for (const date of dates) {
    // 正午解析避免时区把日期推到前一天
    if (week.length && !week.includes(new Date(`${date}T12:00:00`).getDay())) {
      continue;
    }
    const key = `${form.roomTypeId}|${date}`;
    const current =
      overrides[key] ??
      ({
        date,
        price: roomType.price,
        availableStock: roomType.stock,
        status: 1,
      } as CalendarRow);
    if (form.closed) {
      overrides[key] = { ...current, status: 0 };
    } else {
      overrides[key] = {
        ...current,
        status: 1,
        price: form.price == null ? current.price : Number(form.price),
        availableStock:
          form.availableStock == null
            ? current.availableStock
            : Math.min(Number(form.availableStock), roomType.stock),
      };
    }
    count++;
  }
  return { count };
};
