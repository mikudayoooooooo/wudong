// 领域类型（与后端 accommodation/operate 返回结构同构，camelCase）。
// 注意：后端 decimal 字段（rating/price/minPrice）序列化后可能是 string，本层已归一为 number；
// 页面只消费下列类型，不感知数据源。

/** 民宿 */
export interface Hotel {
  id: number;
  name: string;
  address: string;
  /** 风格标签（如 苗寨/山景/家庭） */
  styleTags: string[];
  /** 设施标签（如 WiFi/空调） */
  facilityTags: string[];
  mainImage: string;
  images: string[];
  intro: string;
  rating: number;
  reviewCount: number;
  /** 起价：启用房型最低基础价；无可用房型为 null */
  minPrice: number | null;
  checkInTime: string;
  checkOutTime: string;
  petPolicy: string;
  /** 是否含早餐：1 含早 0 不含早 */
  hasBreakfast: number;
}

/** 房型 */
export interface RoomType {
  id: number;
  hotelId: number;
  name: string;
  bedType: string;
  /** 最多入住人数 */
  maxGuests: number;
  /** 基础价格（api 层已 Number() 归一） */
  price: number;
  /** 房间数量 */
  stock: number;
  area?: number | null;
  images?: string[];
  /** 1 正常 0 停用 */
  status?: number;
}

/** 房态日历行 */
export interface CalendarRow {
  date: string;
  /** 当日价格（api 层已 Number() 归一） */
  price: number;
  /** 当日可售间数（0 = 满房） */
  availableStock: number;
  /** 1 可订 0 不可订（关房） */
  status: number;
}

/** 民宿详情：基本信息 + 启用房型 */
export interface HotelDetail {
  info: Hotel;
  roomTypes: RoomType[];
}

/** 民宿搜索条件（列表页 URL 同步字段子集） */
export interface HotelQuery {
  keyword?: string;
  /** 单风格标签（后端 JSON_CONTAINS） */
  styleTags?: string;
  rating?: number;
  /** 排序：rating | price | priceDesc，缺省按 id 倒序 */
  sort?: string;
  page?: number;
  size?: number;
}

/** 首页轮播/横幅 */
export interface Banner {
  id?: number;
  title: string;
  image: string;
  /** 跳转类型：page/... */
  linkType: string;
  /** 跳转地址 */
  linkValue?: string | null;
  /** 位置：home/product/food/accommodation 等 */
  position: string;
  sort: number;
}

/** 平台公告 */
export interface Announcement {
  id?: number;
  title: string;
  content: string;
  /** 1 系统 2 活动 */
  type: number;
  /** 是否置顶：1 是 0 否 */
  isTop: number;
}
