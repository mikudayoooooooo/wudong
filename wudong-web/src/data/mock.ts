import type {
  ScenicSpot, TicketType, InventoryDay, ItineraryStop, RoutePackage, ETicket,
  TrafficGuide, Review, UserBrief, Post, PostFootprint, Topic, RecommendSlot,
} from '../types'

// ---- 基础数据（模块级可变数组：购票/发布等操作就地修改，模拟后端） ----
const spots: ScenicSpot[] = [
  { id: 1, name: '乌东梯田', type: 'spot', icon: '🌄', address: '乌东村北', openTime: '全天', intro: '苗寨梯田日出观景地' },
  { id: 2, name: '银饰工坊', type: 'experience', icon: '⚒️', address: '乌东村中街', openTime: '09:00-18:00', intro: '苗族银饰锻造体验' },
  { id: 3, name: '长桌宴', type: 'dining', icon: '🍲', address: '乌东村广场', openTime: '11:00-21:00', intro: '苗家长桌宴·酸汤鱼' },
  { id: 4, name: '吊脚楼民宿', type: 'stay', icon: '🏡', address: '乌东村东头', openTime: '全天', intro: '苗族吊脚楼特色民宿' },
  { id: 5, name: '蜡染坊', type: 'experience', icon: '🎨', address: '乌东村南街', openTime: '09:00-17:00', intro: '蜡染手作体验' },
  { id: 6, name: '芦笙广场', type: 'spot', icon: '🥁', address: '乌东村中心', openTime: '全天', intro: '芦笙舞与节庆集会地' },
]

const ticketTypes: TicketType[] = [
  { id: 11, spotId: 1, name: '成人票', price: 60, stock: 200 },
  { id: 12, spotId: 1, name: '学生票', price: 30, stock: 100 },
  { id: 13, spotId: 6, name: '成人票', price: 40, stock: 300 },
  { id: 14, spotId: 6, name: '家庭套票', price: 100, stock: 50 },
]

const inventories: InventoryDay[] = [
  { itemType: 'route', itemId: 1, useDate: '2026-09-12', total: 30, sold: 7 },
  { itemType: 'route', itemId: 1, useDate: '2026-09-13', total: 30, sold: 22 },
  { itemType: 'route', itemId: 1, useDate: '2026-09-14', total: 30, sold: 30 },
  { itemType: 'route', itemId: 2, useDate: '2026-09-12', total: 20, sold: 3 },
  { itemType: 'route', itemId: 2, useDate: '2026-09-13', total: 20, sold: 12 },
  { itemType: 'route', itemId: 3, useDate: '2026-09-12', total: 12, sold: 0 },
  { itemType: 'route', itemId: 3, useDate: '2026-09-13', total: 12, sold: 1 },
  { itemType: 'ticket', itemId: 11, useDate: '2026-09-12', total: 200, sold: 45 },
  { itemType: 'ticket', itemId: 13, useDate: '2026-09-12', total: 300, sold: 120 },
]

const routes: RoutePackage[] = [
  {
    id: 1, title: '苗寨深度两日游', days: 2, theme: '经典', price: 899,
    includes: ['门票', '长桌宴', '民宿一晚', '导游'], departure: '凯里南站', destination: '乌东村',
    hotelStandard: '吊脚楼特色民宿', mealStandard: '长桌宴 + 苗家早餐',
    notice: '使用日期前24小时可退（扣10%手续费）；最少提前1天预订', sales: 1284,
  },
  {
    id: 2, title: '晨雾梯田摄影一日游', days: 1, theme: '摄影', price: 299,
    includes: ['门票', '跟拍摄影点'], departure: '凯里南站', destination: '乌东村',
    hotelStandard: '无住宿', mealStandard: '苗家午餐', notice: '含早出发，请自备保暖', sales: 487,
  },
  {
    id: 3, title: '蜡染体验半日游', days: 1, theme: '体验', price: 199,
    includes: ['门票', '蜡染手作材料', '匠人指导'], departure: '乌东村口', destination: '蜡染坊',
    hotelStandard: '无住宿', mealStandard: '不含餐', notice: '上新路线，成团即行；成品当日带走', sales: 0,
  },
]

const itineraries: ItineraryStop[] = [
  { id: 101, routeId: 1, dayNo: 1, sort: 1, spotId: 1, desc: '梯田日出观景' },
  { id: 102, routeId: 1, dayNo: 1, sort: 2, spotId: 3, desc: '长桌宴午餐' },
  { id: 103, routeId: 1, dayNo: 1, sort: 3, spotId: 4, desc: '入住吊脚楼' },
  { id: 104, routeId: 1, dayNo: 2, sort: 1, spotId: 2, desc: '银饰锻造体验' },
  { id: 105, routeId: 1, dayNo: 2, sort: 2, spotId: 6, desc: '芦笙舞广场' },
  { id: 106, routeId: 2, dayNo: 1, sort: 1, spotId: 1, desc: '晨雾拍摄' },
  { id: 107, routeId: 2, dayNo: 1, sort: 2, spotId: 2, desc: '工坊人文扫街' },
  { id: 108, routeId: 3, dayNo: 1, sort: 1, spotId: 5, desc: '蜡染手作体验' },
]

const users: UserBrief[] = [
  { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾', bio: '山野与烟火气都爱' },
  { id: 2, nickname: '奶爸游记', avatar: '👨', bio: '带娃看世界' },
  { id: 3, nickname: '快门手', avatar: '📷', bio: '只拍晨雾和夜晚' },
  { id: 4, nickname: '干饭人小王', avatar: '🍚', bio: '为吃而行' },
]

const eTickets: ETicket[] = [
  // 用户1：路线1 已核销（覆盖行程站点 1,3,4,2,6 中的 4 站演示用：蜡染坊5不在路线1）
  { id: 201, orderNo: 'WD20260901-0001', userId: 1, itemType: 'route', itemId: 1, useDate: '2026-09-01', status: 'used', verifyTime: '2026-09-01T10:24:00' },
  // 用户1：单景点票（梯田，9/1 核销）
  { id: 202, orderNo: 'WD20260901-0002', userId: 1, itemType: 'ticket', itemId: 11, useDate: '2026-09-01', status: 'used', verifyTime: '2026-09-01T10:24:00' },
  // 用户1：一张待使用票（9/13 路线1）
  { id: 203, orderNo: 'WD20260913-0003', userId: 1, itemType: 'route', itemId: 1, useDate: '2026-09-13', status: 'unused' },
  // 用户2：路线1 已核销；用户3：摄影路线已核销
  { id: 204, orderNo: 'WD20260902-0004', userId: 2, itemType: 'route', itemId: 1, useDate: '2026-09-02', status: 'used', verifyTime: '2026-09-02T09:00:00' },
  { id: 205, orderNo: 'WD20260903-0005', userId: 3, itemType: 'route', itemId: 2, useDate: '2026-09-03', status: 'used', verifyTime: '2026-09-03T05:40:00' },
  // 用户2：一张已退款票（不应点亮）
  { id: 206, orderNo: 'WD20260820-0006', userId: 2, itemType: 'ticket', itemId: 13, useDate: '2026-08-20', status: 'refunded' },
]

const guides: TrafficGuide[] = [
  { id: 301, title: '贵阳→乌东', departure: '贵阳北', transportType: '高铁+班车', duration: '约2.5小时', cost: 180, detail: '贵阳北→凯里南高铁约1.5小时，凯里客车站班车1小时直达乌东村口。' },
  { id: 302, title: '凯里→乌东', departure: '凯里', transportType: '班车直达', duration: '约1小时', cost: 35, detail: '凯里客车站每日 8:00/13:00 两班直达乌东。' },
  { id: 303, title: '广州→乌东', departure: '广州南', transportType: '高铁+包车', duration: '约5.5小时', cost: 480, detail: '广州南→凯里南约4小时，出站包车1.5小时进村。' },
]

const reviews: Review[] = [
  { id: 401, targetType: 'route', targetId: 1, userId: 4, rating: 5, content: '长桌宴的酸汤鱼绝了，导游很会讲苗族故事。' },
  { id: 402, targetType: 'route', targetId: 1, userId: 2, rating: 5, content: '带孩子体验银饰锻造，值回票价。' },
  { id: 403, targetType: 'scenic', targetId: 1, userId: 3, rating: 5, content: '晨雾六点十分准时从谷底漫上来，机位在东侧亭子。' },
]

const topics: Topic[] = [
  { id: 501, name: '#苗寨风光', intro: '分享苗寨美景', viewCount: 21000, bindRouteIds: [2], hot: true },
  { id: 502, name: '#徒步路线', intro: '用脚步丈量苗寨', viewCount: 5103, bindRouteIds: [1], hot: true },
  { id: 503, name: '#美食打卡', intro: '长桌宴与酸汤鱼', viewCount: 8900, bindRouteIds: [], hot: true },
  { id: 504, name: '#非遗手作', intro: '银饰与蜡染', viewCount: 3877, bindRouteIds: [1], hot: false },
]

const posts: Post[] = [
  {
    id: 601, userId: 1, title: '晨雾还没散，就到了观景台', content: '五点半摸黑上山，六点十分雾从谷底漫上来，梯田一层层亮起来。银饰工坊的老师傅手真稳，吊脚楼夜里能听见虫鸣。',
    images: [0, 1, 2], topicIds: [501, 502], linkedRouteId: 1,
    viewCount: 5200, likeCount: 328, commentCount: 41, favoriteCount: 96, createTime: '2026-09-02T08:30:00',
  },
  {
    id: 602, userId: 4, title: '长桌宴扫街指南', content: '酸汤鱼、糯米饭、米酒，按这个顺序吃。座位越靠里越热闹。', images: [1], video: true, topicIds: [503],
    viewCount: 3100, likeCount: 256, commentCount: 38, favoriteCount: 60, createTime: '2026-09-05T12:00:00',
  },
  {
    id: 603, userId: 2, title: '带娃做蜡染的一下午', content: '小朋友专注了两小时，成品挂在民宿床头。', images: [2, 3], topicIds: [504], linkedRouteId: 1,
    viewCount: 1800, likeCount: 189, commentCount: 22, favoriteCount: 44, createTime: '2026-09-06T17:20:00',
  },
  {
    id: 604, userId: 3, title: '徒步环线全程记录', content: '环寨 8 公里，五站全点亮，附机位图。', images: [5, 0], topicIds: [502],
    viewCount: 4200, likeCount: 210, commentCount: 58, favoriteCount: 77, createTime: '2026-09-07T20:00:00',
  },
  {
    id: 605, userId: 3, title: '雨后的吊脚楼', content: '青瓦挂水，屋檐滴水成线。', images: [3], topicIds: [501],
    viewCount: 1500, likeCount: 87, commentCount: 12, favoriteCount: 20, createTime: '2026-09-08T09:10:00',
  },
  {
    id: 606, userId: 2, title: '苗绣伴手礼挑选攻略', content: '看针脚密度和背面线头，老手艺背面也整齐。', images: [4], topicIds: [504],
    viewCount: 900, likeCount: 45, commentCount: 6, favoriteCount: 15, createTime: '2026-09-08T15:00:00',
  },
]

const postFootprints: PostFootprint[] = [
  // 601：模式B（关联路线1），4/5 站点亮，蜡染坊(5)不在路线1行程中、银饰工坊(2)未核销 → 快照里没有它（locked 展示时补）
  { postId: 601, userId: 1, spotId: 1, routeId: 1, mode: 'route', dayNo: 1, memo: '晨雾六点十分', status: 'normal' },
  { postId: 601, userId: 1, spotId: 3, routeId: 1, mode: 'route', dayNo: 1, memo: '酸汤鱼两碗', status: 'normal' },
  { postId: 601, userId: 1, spotId: 4, routeId: 1, mode: 'route', dayNo: 1, status: 'normal' },
  { postId: 601, userId: 1, spotId: 6, routeId: 1, mode: 'route', dayNo: 2, status: 'normal' },
  // 603：模式B，2/5 站
  { postId: 603, userId: 2, spotId: 3, routeId: 1, mode: 'route', dayNo: 1, status: 'normal' },
  { postId: 603, userId: 2, spotId: 5, routeId: 1, mode: 'route', dayNo: 2, memo: '娃的处女作', status: 'normal' },
]

const recommendSlots: RecommendSlot[] = [
  { id: 701, title: '苗寨深度两日游 · 邂逅梯田日出', subtitle: '¥899 起 · 已售 1,284 · 平均点亮 4/5 站', badge: '运营置顶 · 本周精选', itemType: 'route', itemId: 1, sort: 1, rotationGroup: 1, intervalSeconds: 5 },
  { id: 702, title: '晨雾梯田摄影一日游', subtitle: '¥299 起 · 本周 +89 人成行', badge: '摄影主题 · 热度上升', itemType: 'route', itemId: 2, sort: 2, rotationGroup: 1, intervalSeconds: 5 },
  { id: 703, title: '芦笙广场 · 节庆进行时', subtitle: '成人票 ¥40 · 家庭套票 ¥100', badge: '亲子优选 · 好评率 98%', itemType: 'scenic', itemId: 6, sort: 3, rotationGroup: 1, intervalSeconds: 5 },
]

// ---- 导出只读函数（组件禁止直接 import 数组本体） ----
export const getRecommendSlots = (): RecommendSlot[] => [...recommendSlots]
export const getAllSpots = (): ScenicSpot[] => [...spots]
export const getSpot = (id: number): ScenicSpot | undefined => spots.find((s) => s.id === id)
export const getRoutes = (): RoutePackage[] => [...routes]
export const getRoute = (id: number): RoutePackage | undefined => routes.find((r) => r.id === id)
export const getItinerary = (routeId: number): ItineraryStop[] =>
  itineraries.filter((i) => i.routeId === routeId).sort((a, b) => a.dayNo - b.dayNo || a.sort - b.sort)
export const getTicketTypes = (spotId: number): TicketType[] => ticketTypes.filter((t) => t.spotId === spotId)
export const findTicketType = (id: number): TicketType | undefined => ticketTypes.find((t) => t.id === id)
export const getAllTicketTypes = (): TicketType[] => [...ticketTypes]
export const getInventories = (itemType: 'ticket' | 'route', itemId: number): InventoryDay[] =>
  inventories.filter((i) => i.itemType === itemType && i.itemId === itemId)
export const getGuides = (): TrafficGuide[] => [...guides]
export const getReviews = (targetType: 'scenic' | 'route', targetId: number): Review[] =>
  reviews.filter((r) => r.targetType === targetType && r.targetId === targetId)
export const getUsers = (): UserBrief[] => [...users]
export const getUser = (id: number): UserBrief | undefined => users.find((u) => u.id === id)
export const getPosts = (): Post[] => [...posts]
export const getPost = (id: number): Post | undefined => posts.find((p) => p.id === id)
export const getTopics = (): Topic[] => [...topics]
export const getTopic = (id: number): Topic | undefined => topics.find((t) => t.id === id)
export const getETickets = (userId: number): ETicket[] => eTickets.filter((t) => t.userId === userId)
export const getPostFootprints = (postId: number): PostFootprint[] => postFootprints.filter((f) => f.postId === postId)
export const allETickets = (): ETicket[] => [...eTickets]
// 供后续任务（购票/发布）写入的内部数组导出——仅 store 层允许使用
export const __mockWritable = { inventories, eTickets, posts, postFootprints }
