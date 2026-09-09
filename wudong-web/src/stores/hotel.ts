// hotel store：首页精选/列表可复用状态。Task 4 先提供精选（featured）加载。
// 数据源统一走 api/accommodation（USE_MOCK 切换在 api 层内完成），本层只消费归一后类型。
import { defineStore } from 'pinia';
import { searchHotels } from '../api/accommodation';
import type { Hotel } from '../api/types';

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    /** 精选民宿（首页，rating 最高的 3 条） */
    featured: [] as Hotel[],
    /** 精选加载中标记（驱动骨架/加载文案） */
    loadingFeatured: false,
  }),
  actions: {
    /** 拉取精选民宿：searchHotels({ size: 3, sort: 'rating' }) 后截断为 3 条；失败向上抛出由页面提示 */
    async loadFeatured(): Promise<void> {
      this.loadingFeatured = true;
      try {
        const list = await searchHotels({ size: 3, sort: 'rating' });
        this.featured = (list || []).slice(0, 3);
      } finally {
        this.loadingFeatured = false;
      }
    },
  },
});
