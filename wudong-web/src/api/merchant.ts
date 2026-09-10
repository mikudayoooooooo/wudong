// 商家区数据层：真实后端(8001) 与 mocks 同构数据间选择（唯一判据 USE_MOCK）。
// 两条分支的返回都过同一归一（normalize.ts），视图只消费归一后类型。
import { USE_MOCK } from '../env';
import { post, request } from './http';
import {
  normMerchantHotel,
  normMerchantRoomType,
  normRow,
} from './normalize';
import type {
  CalendarBatchForm,
  CalendarRow,
  HotelForm,
  MerchantApplication,
  MerchantApplyForm,
  MerchantHotel,
  MerchantInfo,
  MerchantRoomType,
  PageResult,
  RoomTypeForm,
} from './types';
import {
  mockCalendarBatch,
  mockCalendarRange,
  mockHotelDelete,
  mockHotelInfo,
  mockHotelPage,
  mockHotelSave,
  mockHotelSetStatus,
  mockMerchantApplication,
  mockMerchantApply,
  mockMerchantMy,
  mockRoomTypeDelete,
  mockRoomTypePage,
  mockRoomTypeSave,
} from '../mocks/merchant';

const BASE = '/app/accommodation/merchant';

/** 提交入驻申请 */
export const merchantApply = async (form: MerchantApplyForm): Promise<true> => {
  if (USE_MOCK) return mockMerchantApply();
  return post<true>('/app/merchant/apply', { ...form });
};

/** 最新一次入驻申请进度（无申请时后端不输出 data → undefined → 归 null） */
export const merchantApplication = async (): Promise<MerchantApplication | null> => {
  if (USE_MOCK) return mockMerchantApplication();
  const data = await request<MerchantApplication>('/app/merchant/application');
  return data ?? null;
};

/** 我的店铺（未入驻时后端不输出 data → undefined → 归 null） */
export const merchantMy = async (): Promise<MerchantInfo | null> => {
  if (USE_MOCK) return mockMerchantMy();
  const data = await request<MerchantInfo>('/app/merchant/my');
  return data ?? null;
};

/** 我的民宿分页 */
export const merchantHotelPage = async (q: {
  page?: number;
  size?: number;
  name?: string;
  status?: number;
} = {}): Promise<PageResult<MerchantHotel>> => {
  if (USE_MOCK) return mockHotelPage(q);
  const data = await request<PageResult<MerchantHotel>>(`${BASE}/hotel/page`, {
    page: q.page ?? 1,
    size: q.size ?? 10,
    name: q.name,
    status: q.status,
  });
  return {
    list: (data?.list ?? []).map(normMerchantHotel),
    total: Number(data?.total ?? 0),
  };
};

/** 民宿详情（仅本人） */
export const merchantHotelInfo = async (id: number): Promise<MerchantHotel> => {
  if (USE_MOCK) {
    const info = mockHotelInfo(id);
    if (!info) throw new Error('无权操作该资源');
    return normMerchantHotel(info);
  }
  return normMerchantHotel(
    await request<MerchantHotel>(`${BASE}/hotel/info`, { id })
  );
};

/** 新增/更新民宿（有 id 即更新） */
export const merchantHotelSave = async (form: HotelForm): Promise<MerchantHotel> => {
  if (USE_MOCK) {
    return normMerchantHotel(mockHotelSave(form as MerchantHotel));
  }
  const path = form.id ? `${BASE}/hotel/update` : `${BASE}/hotel/add`;
  if (form.id) {
    await post<boolean>(path, { ...form });
    return normMerchantHotel(
      await request<MerchantHotel>(`${BASE}/hotel/info`, { id: form.id })
    );
  }
  return normMerchantHotel(await post<MerchantHotel>(path, { ...form }));
};

/** 删除民宿（含房型时后端拒绝） */
export const merchantHotelDelete = async (id: number): Promise<true> => {
  if (USE_MOCK) return mockHotelDelete(id);
  return post<true>(`${BASE}/hotel/delete`, { id });
};

/** 上架 / 下架（P8 商家可自管状态） */
export const merchantHotelSetStatus = async (
  id: number,
  status: number
): Promise<true> => {
  if (USE_MOCK) return mockHotelSetStatus(id, status);
  return post<true>(`${BASE}/hotel/update`, { id, status });
};

/** 某民宿的房型列表 */
export const merchantRoomTypePage = async (
  hotelId: number,
  q: { page?: number; size?: number } = {}
): Promise<PageResult<MerchantRoomType>> => {
  if (USE_MOCK) return mockRoomTypePage(hotelId);
  const data = await request<PageResult<MerchantRoomType>>(
    `${BASE}/room-type/page`,
    { hotelId, page: q.page ?? 1, size: q.size ?? 50 }
  );
  return {
    list: (data?.list ?? []).map(normMerchantRoomType),
    total: Number(data?.total ?? 0),
  };
};

/** 新增/更新房型（有 id 即更新） */
export const merchantRoomTypeSave = async (
  form: RoomTypeForm
): Promise<MerchantRoomType> => {
  if (USE_MOCK) {
    return normMerchantRoomType(mockRoomTypeSave(form as MerchantRoomType));
  }
  const path = form.id ? `${BASE}/room-type/update` : `${BASE}/room-type/add`;
  if (form.id) {
    await post<boolean>(path, { ...form });
    const page = await merchantRoomTypePage(form.hotelId);
    const found = page.list.find((r) => r.id === form.id);
    if (!found) throw new Error('房型不存在');
    return found;
  }
  return normMerchantRoomType(await post<MerchantRoomType>(path, { ...form }));
};

/** 删除房型（后端级联清理该房型房态） */
export const merchantRoomTypeDelete = async (id: number): Promise<true> => {
  if (USE_MOCK) return mockRoomTypeDelete(id);
  return post<true>(`${BASE}/room-type/delete`, { id });
};

/** 房态区间查询（无记录日期回退房型基础价/库存） */
export const merchantCalendarRange = async (
  roomTypeId: number,
  start: string,
  end: string
): Promise<CalendarRow[]> => {
  if (USE_MOCK) return mockCalendarRange(roomTypeId, start, end).map(normRow);
  const rows = await request<CalendarRow[]>(`${BASE}/calendar/range`, {
    roomTypeId,
    startDate: start,
    endDate: end,
  });
  return (rows ?? []).map(normRow);
};

/** 批量设置房态（价格/库存/关房，可限定星期几） */
export const merchantCalendarBatch = async (
  form: CalendarBatchForm
): Promise<{ count: number }> => {
  if (USE_MOCK) return mockCalendarBatch(form);
  return post<{ count: number }>(`${BASE}/calendar/batch`, { ...form });
};
