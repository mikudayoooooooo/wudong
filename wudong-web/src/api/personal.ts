// 个人中心：收藏 + 评价（订单/预订在 api/order.ts）
import { http } from '../lib/http'

export type FavoriteType =
  | 'product'
  | 'restaurant'
  | 'hotel'
  | 'scenic'
  | 'route'
  | 'guide'
  | 'post'

/** 收藏/取消收藏（幂等） */
export const favoriteToggle = async (targetType: FavoriteType, targetId: number) => {
  return http.post('/app/member/favorite/toggle', { targetType, targetId })
}

/** 是否已收藏 */
export const favoriteCheck = async (targetType: FavoriteType, targetId: number) => {
  return http.get('/app/member/favorite/check', { targetType, targetId })
}

/** 我的收藏（分页，targetType 可选） */
export const favoritePage = async (
  targetType?: FavoriteType,
  page = 1,
  size = 10
): Promise<{ list: any[]; total: number }> => {
  return http.get('/app/member/favorite/page', { targetType, page, size })
}

/** 评价列表（匿名，按目标） */
export const reviewList = async (targetType: 'scenic' | 'route', targetId: number) => {
  return http.get('/app/travel/review/list', { targetType, targetId })
}

/** 发布评价（需登录；travel 订单完成后，scenic/route） */
export const reviewAdd = async (data: {
  targetType: 'scenic' | 'route'
  targetId: number
  rating: number
  content?: string
  orderNo?: string
}) => {
  return http.post('/app/travel/review/add', data)
}
