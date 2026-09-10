import { http } from '../lib/http'

/** 平台运营位（匿名） */
export const operateApi = {
  announcements: () => http.get<any[]>('/app/operate/announcement/list'),
  banners: (position = 'home') =>
    http.get<any[]>(`/app/operate/banner/list?position=${position}`),
}

/** 公共订单/支付（下单支付链路由 travel booking 起头，这里补支付两步与订单查询） */
export const orderApi = {
  payCreate: (orderNo: string, channel: 'wechat' | 'alipay' = 'wechat') =>
    http.post<{ paymentNo: string }>('/app/pay/create', { orderNo, channel }),
  payMock: (paymentNo: string) => http.post<boolean>('/app/pay/mock', { paymentNo }),
  payRecord: (orderNo: string) => http.get<any[]>(`/app/pay/record?orderNo=${orderNo}`),
  orderPage: (status?: number, page = 1, size = 20) => {
    const qs = new URLSearchParams({ page: String(page), size: String(size) })
    if (status) qs.set('status', String(status))
    return http.get<{ list: any[]; total: number }>(`/app/order/page?${qs}`)
  },
  orderDetail: (orderNo: string) => http.get<any>(`/app/order/detail?orderNo=${orderNo}`),
  orderCancel: (orderNo: string) => http.post<boolean>('/app/order/cancel', { orderNo }),
}
