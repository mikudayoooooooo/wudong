// 餐饮浏览数据层（统一走 lib/http：/api 前缀经 vite 代理、登录接口带 token）
import { http } from '../lib/http';
import type { Restaurant, RestaurantQuery, RestaurantDetail, FarmProduct, FarmProductQuery } from './types';

const toNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

/** 归一餐厅：decimal 字段转 number */
const normRestaurant = (r: Restaurant): Restaurant => ({
  ...r,
  avgPrice: toNum(r.avgPrice),
  rating: toNum(r.rating),
  longitude: toNum(r.longitude),
  latitude: toNum(r.latitude),
  distance: r.distance != null ? toNum(r.distance) : undefined,
});

/** 归一农产品 */
const normFarmProduct = (p: FarmProduct): FarmProduct => ({
  ...p,
  price: toNum(p.price),
  sales: toNum(p.sales),
});

/** 搜索餐厅：按关键字/位置/排序 */
export const searchRestaurants = async (q: RestaurantQuery = {}): Promise<Restaurant[]> => {
  const d = await http.get<{ list: Restaurant[]; pagination: any }>(
    '/app/food/restaurant/list',
    { ...q, page: q.page ?? 1, size: q.size ?? 20 }
  );
  return (d.list || []).map(normRestaurant);
};

/** 餐厅详情（基本信息 + 菜品） */
export const restaurantDetail = async (id: number): Promise<RestaurantDetail> => {
  const info = await http.get<Restaurant>(`/app/food/restaurant/${id}`);
  const dishes = await http.get<any[]>(`/app/food/restaurant/${id}/dishes`);
  return {
    info: normRestaurant(info),
    dishes: dishes || [],
  };
};

/** 获取可预订时段 */
export const getAvailableTimeSlots = async (restaurantId: number, date: string): Promise<any[]> => {
  return await http.get<any[]>(`/app/food/restaurant/${restaurantId}/time-slots`, { date });
};

/** 创建预订（需登录） */
export const createReservation = async (data: {
  restaurantId: number
  timeSlotId: number
  reservationDate: string
  peopleCount: number
  contactName?: string
  contactPhone?: string
  remark?: string
}): Promise<any> => {
  return await http.post('/app/food/reservation/create', data);
};

/** 搜索农产品 */
export const searchFarmProducts = async (q: FarmProductQuery = {}): Promise<FarmProduct[]> => {
  const d = await http.get<{ list: FarmProduct[]; pagination: any }>(
    '/app/food/farm-product/list',
    { ...q, page: q.page ?? 1, size: q.size ?? 20 }
  );
  return (d.list || []).map(normFarmProduct);
};

/** 农产品详情 */
export const farmProductDetail = async (id: number): Promise<any> => {
  const d = await http.get<any>(`/app/food/farm-product/${id}`);
  return {
    ...d,
    price: toNum(d.price),
    stock: toNum(d.stock),
  };
};

/** 获取农产品分类 */
export const getFarmProductCategories = async (): Promise<any[]> => {
  return await http.get<any[]>('/app/food/farm-product/categories');
};
