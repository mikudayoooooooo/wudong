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

/** 会员（C 端登录用户） */
export interface MemberInfo {
  id: number;
  phone: string;
  nickname?: string;
  avatar?: string;
  /** 1 游客 2 商家 */
  role: number;
}

/** 登录结果 */
export interface LoginResult {
  token: string;
  refreshToken?: string;
}

/** 商家（已入驻店铺） */
export interface MerchantInfo {
  id: number;
  userId: number;
  /** 商家账号，如 m12 */
  username: string;
  shopName: string;
  /** 入驻模块 product/food/accommodation/travel */
  module: string;
  contactName: string;
  contactPhone: string;
  /** 1 正常 0 禁用 */
  status: number;
  joinedAt?: string;
}

/** 入驻申请进度（后端 dict：1 待审核 2 已通过 3 已驳回） */
export interface MerchantApplication {
  id: number;
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  idCard: string;
  status: number;
  /** 审核意见（驳回原因） */
  auditResult?: string | null;
}

/** 商家视角的民宿（含 C 端不展示的字段） */
export interface MerchantHotel extends Hotel {
  merchantId: number;
  longitude: number;
  latitude: number;
  deposit: number;
  /** 1 正常 0 下架 */
  status: number;
}

/** 商家视角的房型 */
export interface MerchantRoomType extends RoomType {
  facilities: string[];
  status: number;
}

/** 民宿新增/编辑表单（有 id 即更新） */
export type HotelForm = Omit<
  MerchantHotel,
  'id' | 'merchantId' | 'rating' | 'reviewCount' | 'minPrice'
> & { id?: number };

/** 房型新增/编辑表单（有 id 即更新） */
export type RoomTypeForm = Omit<MerchantRoomType, 'id'> & { id?: number };

/** 入驻申请表单（字段与后端 merchant.apply 必填校验一致） */
export interface MerchantApplyForm {
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  idCard: string;
  idCardFront: string;
  idCardBack: string;
  businessLicense: string;
}

/** 房态批量设置 */
export interface CalendarBatchForm {
  roomTypeId: number;
  startDate: string;
  endDate: string;
  /** 限定星期几（0 周日 … 6 周六），不传表示区间内全部 */
  weekDays?: number[];
  price?: number;
  availableStock?: number;
  /** true 表示关房（不写价与库存） */
  closed?: boolean;
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[];
  total: number;
}
