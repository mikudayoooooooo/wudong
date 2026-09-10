// 订单和购物车API（统一走 lib/http：带 token、POST body、/api 代理前缀）
import { http } from '../lib/http'

/** 添加到购物车（itemType 1-非遗商品 2-农产品） */
export const addToCart = async (itemId: number, itemType: number = 1, quantity: number = 1) => {
  return http.post('/app/cart/add', { itemId, itemType, quantity })
}

/** 更新购物车数量 */
export const updateCartQuantity = async (cartItemId: number, quantity: number) => {
  return http.post('/app/cart/update', { cartItemId, quantity })
}

/** 移除购物车商品 */
export const removeCartItem = async (cartItemId: number) => {
  return http.post('/app/cart/remove', { cartItemId })
}

/** 查看购物车 */
export const getCartList = async () => {
  return http.get('/app/cart/list')
}

/** 清空购物车 */
export const clearCart = async () => {
  return http.post('/app/cart/clear')
}

/** 获取购物车数量 */
export const getCartCount = async (): Promise<number> => {
  return http.get('/app/cart/count')
}

/** 从购物车创建订单 */
export const createOrderFromCart = async (addressId: number, remark?: string) => {
  return http.post('/app/order/create-from-cart', { addressId, remark })
}

/** 创建订单（body 对齐 base create：module/orderType/items/remark） */
export const createOrder = async (body: {
  module: string
  orderType: number
  items: any[]
  remark?: string
}) => {
  return http.post('/app/order/create', body)
}

/** 我的订单列表 */
export const getMyOrders = async (status?: number, page: number = 1, size: number = 10) => {
  return http.get('/app/order/page', { status, page, size })
}

/** 订单详情 */
export const getOrderDetail = async (orderNo: string) => {
  return http.get('/app/order/detail', { orderNo })
}

/** 取消订单 */
export const cancelOrder = async (orderNo: string) => {
  return http.post('/app/order/cancel', { orderNo })
}

/** 创建餐厅预订 */
export const createReservation = async (data: {
  restaurantId: number
  timeSlotId: number
  reservationDate: string
  peopleCount: number
  contactName?: string
  contactPhone?: string
  remark?: string
}) => {
  return http.post('/app/food/reservation/create', data)
}

/** 我的预订列表 */
export const getMyReservations = async (status?: number, page: number = 1, size: number = 10) => {
  return http.get('/app/food/reservation/my', { status, page, size })
}

/** 取消预订 */
export const cancelReservation = async (id: number) => {
  return http.post(`/app/food/reservation/${id}/cancel`)
}
