export type SpotType = 'spot' | 'dining' | 'stay' | 'experience'
export interface ScenicSpot { id: number; name: string; type: SpotType; icon: string; address: string; openTime: string; intro: string }
export interface TicketType { id: number; spotId: number; name: string; price: number; stock: number }
export interface InventoryDay { itemType: 'ticket' | 'route'; itemId: number; useDate: string; total: number; sold: number }
export interface ItineraryStop { id: number; routeId: number; dayNo: number; sort: number; spotId: number; desc: string }
export interface RoutePackage {
  id: number; title: string; days: number; theme: string; price: number
  includes: string[]; departure: string; destination: string
  hotelStandard: string; mealStandard: string; notice: string; sales: number
}
export type ETicketStatus = 'unused' | 'used' | 'refunded'
export interface ETicket {
  id: number; orderNo: string; userId: number
  itemType: 'ticket' | 'route'; itemId: number; useDate: string
  status: ETicketStatus; verifyTime?: string
}
export interface TrafficGuide { id: number; title: string; departure: string; transportType: string; duration: string; cost: number; detail: string }
export interface Review { id: number; targetType: 'scenic' | 'route'; targetId: number; userId: number; rating: number; content: string }
export interface UserBrief { id: number; nickname: string; avatar: string; bio: string }
export type FootprintMode = 'auto' | 'route'
export interface PostFootprint { postId: number; userId: number; spotId: number; routeId?: number; mode: FootprintMode; dayNo?: number; memo?: string; status: 'normal' | 'refunded' }
export interface Post {
  id: number; userId: number; title: string; content: string; images: number[]; video?: boolean
  topicIds: number[]; linkedRouteId?: number
  viewCount: number; likeCount: number; commentCount: number; favoriteCount: number; createTime: string
}
export interface Topic { id: number; name: string; intro: string; viewCount: number; bindRouteIds: number[]; hot: boolean }
export interface RecommendSlot {
  id: number; title: string; subtitle: string; badge: string
  itemType: 'route' | 'scenic' | 'post'; itemId: number
  sort: number; rotationGroup: number; intervalSeconds: number
}
export interface FootprintStopView {
  spotId: number; name: string; icon: string
  lit: boolean; locked: boolean
  lightCount?: number; dayNo?: number; memo?: string; verifyDate?: string
}
