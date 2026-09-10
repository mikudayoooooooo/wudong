// 民宿/房型 mock 数据集（从原型 mock.js 迁移，TS 化；与后端返回结构同构）。
// mockHotels 每条 minPrice 已为 number（对应 api 层归一后的 Hotel.minPrice: number|null）。
import type { Hotel, RoomType } from '../api/types';

const IMG = (seed: string): string => `https://picsum.photos/seed/${seed}/900/600`;

export const mockHotels: Hotel[] = [
  {
    id: 1,
    name: '乌东苗寨木楼',
    address: '雷山县 · 乌东村一组',
    styleTags: ['苗寨', '江景'],
    facilityTags: ['WiFi', '空调', '独立卫浴'],
    intro: '坐落于梯田之上的百年木楼，推窗见云雾青山。',
    rating: 4.8,
    reviewCount: 126,
    mainImage: IMG('h1'),
    images: [IMG('h1'), IMG('h1b')],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    petPolicy: '可携带小型宠物',
    hasBreakfast: 1,
    minPrice: 380,
  },
  {
    id: 2,
    name: '吊脚楼里看星空',
    address: '雷山县 · 乌东村二组',
    styleTags: ['苗寨', '观星'],
    facilityTags: ['WiFi', '电热毯'],
    intro: '顶楼露台正对银河，是摄影与观星爱好者私藏地。',
    rating: 4.6,
    reviewCount: 88,
    mainImage: IMG('h2'),
    images: [IMG('h2')],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    petPolicy: '不可携带宠物',
    hasBreakfast: 0,
    minPrice: 260,
  },
  {
    id: 3,
    name: '青山伴月 · 山景民宿',
    address: '雷山县 · 乌东村三组',
    styleTags: ['山景', '家庭'],
    facilityTags: ['WiFi', '空调', '儿童设施'],
    intro: '带大露台的家庭民宿，适合亲子与长住旅居。',
    rating: 4.9,
    reviewCount: 210,
    mainImage: IMG('h3'),
    images: [IMG('h3')],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    petPolicy: '可携带宠物',
    hasBreakfast: 1,
    minPrice: 520,
  },
];

// 房型模板（每个民宿都挂同套房型，id 用 hotelId*10+序号 保证全局唯一）
const ROOM_TEMPLATES: Array<Omit<RoomType, 'hotelId' | 'id'>> = [
  { name: '苗族木屋大床房', bedType: '大床', maxGuests: 2, price: 380, stock: 3, status: 1, images: [IMG('r1')] },
  { name: '吊脚楼双床房', bedType: '双床', maxGuests: 2, price: 520, stock: 2, status: 1, images: [IMG('r2')] },
];

/** 某民宿的启用房型（id 全局唯一） */
export const roomTypesOf = (hotelId: number): RoomType[] =>
  ROOM_TEMPLATES.map((t, i) => ({ ...t, id: hotelId * 10 + i + 1, hotelId }));

/** 全量房型（跨民宿） */
export const mockRoomTypes: RoomType[] = mockHotels.flatMap((h) => roomTypesOf(h.id));

/** 按房型 id 查找（日历 mock 取基础价/库存） */
export const mockRoomTypeById = (id: number): RoomType | undefined =>
  mockRoomTypes.find((r) => r.id === id);

/** 按民宿 id 查找 */
export const hotelById = (id: number): Hotel | undefined =>
  mockHotels.find((h) => h.id === id);
