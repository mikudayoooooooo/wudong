// 运营位 mock：banner/公告示例（结构 = api/types Banner/Announcement，与后端同构）。
import type { Announcement, Banner } from '../api/types';

export const mockBanners: Banner[] = [
  {
    id: 1,
    title: '乌东 · 云上苗寨',
    image: 'https://picsum.photos/seed/mz1/1600/620',
    linkType: 'page',
    linkValue: '/',
    position: 'home',
    sort: 1,
  },
  {
    id: 2,
    title: '吊脚楼里的慢时光',
    image: 'https://picsum.photos/seed/mz2/1600/620',
    linkType: 'page',
    linkValue: '/hotels',
    position: 'home',
    sort: 2,
  },
  {
    id: 3,
    title: '苗族非遗手作节',
    image: 'https://picsum.photos/seed/mz3/1600/620',
    linkType: 'page',
    linkValue: '/hotels',
    position: 'home',
    sort: 3,
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: '欢迎来到雷山县乌东村，云上苗寨',
    content: '一座藏在云雾里的苗族古村落，木楼、吊脚楼与梯田相映。',
    type: 1,
    isTop: 1,
  },
  {
    id: 2,
    title: '国庆民宿预订通道即将开启',
    content: '预订功能建设中，敬请期待。',
    type: 2,
    isTop: 0,
  },
];
