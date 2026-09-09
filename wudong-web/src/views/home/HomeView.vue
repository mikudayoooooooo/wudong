<script setup lang="ts">
// 首页：Hero 轮播（banner）+ 公告条 + 精选民宿 + 「来乌东住一宿」预订占位 CTA。
// 数据源：banner/公告 走 api/operate；精选走 hotel store（store 内调 searchHotels，大小写/归一在 api 层完成）。
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BannerCarousel from '@/components/BannerCarousel.vue';
import Ticker from '@/components/Ticker.vue';
import HotelCard from '@/components/HotelCard.vue';
import ComingSoonTag from '@/components/ComingSoonTag.vue';
import { announcements, banners } from '@/api/operate';
import { useHotelStore } from '@/stores/hotel';
import type { Announcement, Banner } from '@/api/types';

const store = useHotelStore();

const heroBanners = ref<Banner[]>([]);
const announcementList = ref<Announcement[]>([]);
const loading = ref(true);
const bannerFailed = ref(false);
const announceFailed = ref(false);
const featuredFailed = ref(false);

/** 首页数据：banner/公告（api/operate）与精选（store.loadFeatured）并行加载，逐区容忍失败 */
async function loadHome(): Promise<void> {
  loading.value = true;
  bannerFailed.value = false;
  announceFailed.value = false;
  featuredFailed.value = false;
  const results = await Promise.allSettled([
    banners('home').then((d) => {
      heroBanners.value = d;
    }),
    announcements().then((d) => {
      announcementList.value = d;
    }),
    store.loadFeatured(),
  ]);
  bannerFailed.value = results[0].status === 'rejected';
  announceFailed.value = results[1].status === 'rejected';
  featuredFailed.value = results[2].status === 'rejected';
  loading.value = false;
}

// 精选卡片点击：Task 4 时详情页未接（Task 6 才落地 /hotels/:id），先导至民宿列表页 /hotels 保持可浏览。
// router 仅在手势时注入（单测 mount 不挂 router，渲染期不依赖路由注入）。
function goHotels(): void {
  const router = useRouter();
  router.push('/hotels');
}

onMounted(loadHome);
</script>

<template>
  <main class="container home">
    <!-- Hero 轮播 -->
    <BannerCarousel v-if="!bannerFailed && heroBanners.length" :banners="heroBanners" />
    <div v-else-if="loading && !bannerFailed" class="hero-skeleton" aria-hidden="true"></div>
    <div v-else-if="bannerFailed" class="hero-fallback">
      <p>轮播图加载失败，请稍后重试</p>
      <button type="button" class="retry" @click="loadHome">重新加载</button>
    </div>
    <div v-else class="hero-fallback">
      <p>暂无运营内容，敬请期待</p>
    </div>

    <!-- 公告条 -->
    <Ticker v-if="announcementList.length" :items="announcementList" />
    <p v-else-if="announceFailed" class="ticker-note">公告加载失败（点击上方重试可刷新）</p>

    <!-- 精选民宿 -->
    <section class="section">
      <div class="section-title">
        <h2>精选民宿</h2>
        <button type="button" class="more" @click="goHotels">查看全部 →</button>
      </div>
      <div v-if="store.loadingFeatured" class="state-note">精选民宿加载中…</div>
      <div v-else-if="featuredFailed" class="state-note">
        精选民宿加载失败，<button type="button" class="retry" @click="loadHome">重试</button>
      </div>
      <div v-else-if="store.featured.length" class="hotel-grid">
        <HotelCard v-for="h in store.featured" :key="h.id" :hotel="h" @click="goHotels" />
      </div>
      <p v-else class="empty-state">暂无精选民宿，敬请期待。</p>
    </section>

    <!-- 来乌东住一宿 CTA（预订占位，无订单/支付后端，禁用） -->
    <section class="section cta">
      <h3>来乌东住一宿</h3>
      <p>在线预订、入住码、动态定价——正在建设中，先逛逛民宿与房态吧。</p>
      <button type="button" class="btn-primary" disabled>
        <span>预订</span>
        <ComingSoonTag />
      </button>
    </section>
  </main>
</template>

<style scoped>
.home {
  padding-bottom: 8px;
}
/* Hero 缺失/加载失败兜底占位 */
.hero-skeleton {
  height: 420px;
  border-radius: 0 0 26px 26px;
  background: linear-gradient(135deg, var(--green-300), var(--green-100));
}
.hero-fallback {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  color: var(--muted);
  font-size: 14px;
  margin-top: 20px;
}
.ticker-note {
  margin: 18px 0 0;
  padding: 10px 16px;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  color: var(--muted);
  font-size: 13px;
}
.retry {
  border: 0;
  background: none;
  color: var(--green-500);
  cursor: pointer;
  text-decoration: underline;
  font-size: 13px;
}
/* 精选网格 */
.hotel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.section-title .more {
  border: 0;
  background: none;
  padding: 0;
  color: var(--green-500);
  font-size: 13px;
}
.state-note {
  padding: 30px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
.empty-state {
  margin: 0;
  padding: 30px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
/* CTA：来乌东住一宿 */
.cta {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px;
}
.cta h3 {
  margin: 0 0 6px;
  color: var(--green-900);
}
.cta p {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 14px;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold-500);
  color: #fff;
  border: 0;
  padding: 9px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: not-allowed;
  box-shadow: 0 6px 16px rgba(232, 150, 62, 0.35);
}
.btn-primary:disabled {
  background: #d8c4ac;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
