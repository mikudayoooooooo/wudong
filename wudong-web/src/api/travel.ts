import { http } from '../lib/http'

/** 足迹站点视图（后端 routeStopsView） */
export interface StopView {
  spotId: number
  dayNo?: number
  description?: string
  name?: string
  icon?: string
  type?: string
  lit: boolean
  locked: boolean
  lightCount?: number
  memo?: string
  photo?: string
}

export interface RouteDetail {
  id: number
  title: string
  days: number
  theme: string
  price: string | number
  includes: string[]
  departure: string
  destination: string
  hotelStandard: string
  mealStandard: string
  notice: string
  sales: number
  stops: StopView[]
  inventories: { itemType: string; itemId: number; useDate: string; total: number; sold: number }[]
  reviews: any[]
}

export const travelApi = {
  scenicList: (type?: string) =>
    http.get<any[]>(`/app/travel/scenic/list${type ? `?type=${type}` : ''}`),
  scenicDetail: (id: number) => http.get<any>(`/app/travel/scenic/detail?id=${id}`),
  routeList: (q?: { theme?: string; days?: number; keyword?: string }) => {
    const qs = new URLSearchParams()
    if (q?.theme) qs.set('theme', q.theme)
    if (q?.days) qs.set('days', String(q.days))
    if (q?.keyword) qs.set('keyword', q.keyword)
    const s = qs.toString()
    return http.get<any[]>(`/app/travel/route/list${s ? `?${s}` : ''}`)
  },
  routeDetail: (id: number) => http.get<RouteDetail>(`/app/travel/route/detail?id=${id}`),
  guideList: () => http.get<any[]>('/app/travel/guide/list'),
  recommendList: (position = 'home') =>
    http.get<any[]>(`/app/travel/recommend/list?position=${position}`),
  inventoryList: (itemType: string, itemId: number) =>
    http.get<any[]>(`/app/travel/inventory/list?itemType=${itemType}&itemId=${itemId}`),
  reviewList: (targetType: string, targetId: number) =>
    http.get<any[]>(`/app/travel/review/list?targetType=${targetType}&targetId=${targetId}`),
  reviewAdd: (p: { targetType: string; targetId: number; rating: number; content?: string; orderNo?: string }) =>
    http.post<{ id: number }>('/app/travel/review/add', p),
  /** 下单（服务端查价）→ {orderNo, payAmount, ticketIds} */
  bookingCreate: (p: { itemType: 'ticket' | 'route'; itemId: number; useDate: string; quantity: number; visitors?: any[] }) =>
    http.post<{ orderNo: string; payAmount: number; ticketIds: number[] }>('/app/travel/booking/create', p),
  ticketMy: () => http.get<any[]>('/app/travel/ticket/my'),
  ticketRefund: (orderNo: string) =>
    http.post<{ refundAmount: number; ticketCount: number }>('/app/travel/ticket/refund', { orderNo }),
}
