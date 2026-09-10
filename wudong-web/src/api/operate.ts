// 运营位数据层：真实后端(8001) 与 mocks 同构数据间选择（唯一判据 USE_MOCK）。
import { USE_MOCK } from '../env';
import { request } from './http';
import type { Announcement, Banner } from './types';
import { mockAnnouncements, mockBanners } from '../mocks/operate';

/** 轮播图下发（按 position 筛选） */
export const banners = async (position = 'home'): Promise<Banner[]> => {
  if (USE_MOCK) {
    return mockBanners.filter((b) => b.position === position);
  }
  return request<Banner[]>('/app/operate/banner', { position });
};

/** 平台公告下发 */
export const announcements = async (): Promise<Announcement[]> => {
  if (USE_MOCK) return mockAnnouncements.slice();
  return request<Announcement[]>('/app/operate/announcement');
};
