// 订单和购物车API
import { request } from './http';

/** 添加到购物车 */
export const addToCart = async (productId: number, quantity: number = 1) => {
  return request('/app/cart/add', { productId, skuId: 0, quantity });
};

/** 创建订单 */
export const createOrder = async (items: any[]) => {
  return request('/app/order/create', { items });
};

/** 我的订单列表 */
export const getMyOrders = async (status?: number, page: number = 1, size: number = 10) => {
  return request('/app/order/page', { status, page, size });
};

/** 订单详情 */
export const getOrderDetail = async (orderNo: string) => {
  return request('/app/order/detail', { orderNo });
};

/** 取消订单 */
export const cancelOrder = async (orderNo: string) => {
  return request('/app/order/cancel', { orderNo });
};

/** 创建餐厅预订 */
export const createReservation = async (data: {
  restaurantId: number;
  timeSlotId: number;
  reservationDate: string;
  peopleCount: number;
  contactName?: string;
  contactPhone?: string;
  note?: string;
}) => {
  return request('/app/food/reservation/create', data);
};

/** 我的预订列表 */
export const getMyReservations = async (status?: number, page: number = 1, size: number = 10) => {
  return request('/app/food/reservation/my-list', { status, page, size });
};

/** 取消预订 */
export const cancelReservation = async (id: number) => {
  return request('/app/food/reservation/cancel', { id });
};
