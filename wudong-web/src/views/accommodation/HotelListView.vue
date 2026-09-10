<script setup lang="ts">
// 民宿列表页：URL 同步筛选。数据只读 api/accommodation.searchHotels（USE_MOCK 切换在 api 层），
// 列表/筛选状态保持在组件局部 ref（不依赖数据源，便于单测）。
// 交互：初始 onMounted 从 route 解析筛选 → 查询；FilterBar 变更(update:modelValue+search) → 重新查询并 router.replace 同步 URL。
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FilterBar from '@/components/FilterBar.vue';
import HotelCard from '@/components/HotelCard.vue';
import { searchHotels } from '@/api/accommodation';
import { parseHotelQuery, toQueryString } from '@/utils/query';
import type { Hotel, HotelQuery } from '@/api/types';

const route = useRoute();
const router = useRouter();

/** 风格筛选选项（与原型列表区一致；后端暂无独立风格字典接口） */
const styleOptions: string[] = ['苗寨', '江景', '山景', '观星', '家庭', '经济'];

// 初始筛选从当前 URL 恢复（route.fullPath 含编码后 query；parse 负责 decode+归一）
const query = ref<HotelQuery>(parseHotelQuery(route.fullPath.split('?')[1] ?? ''));
const list = ref<Hotel[]>([]);
const loading = ref(true);
const failed = ref(false);
/** 请求序号：每次 doSearch 自增，响应回来仅当仍是最新请求才写回 list/URL（防慢响应乱序覆盖） */
let reqSeq = 0;

async function doSearch(): Promise<void> {
  const seq = ++reqSeq;
  loading.value = true;
  failed.value = false;
  try {
    const hotels = await searchHotels(query.value);
    if (seq !== reqSeq) return; // 已发新请求，本响应过期，丢弃（不改 list/URL）
    list.value = hotels;
    const qs = toQueryString(query.value);
    // URL 同步：全量字符串 raw-location（vue-router object-location 的 query 只接受对象，
    // 而 toQueryString 产物需经 parseURL 才得到结构化 query）
    await router.replace(qs ? `${route.path}?${qs}` : route.path);
  } catch {
    if (seq !== reqSeq) return; // 过期请求的错误同样丢弃
    list.value = [];
    failed.value = true;
  } finally {
    if (seq === reqSeq) loading.value = false; // 仅最新请求控制 loading
  }
}

/** 卡片点击 → 详情路由（/hotels/:id 落地在 Task 6，先 push 占位即可） */
function goDetail(id: number): void {
  router.push(`/hotels/${id}`);
}

onMounted(doSearch);
</script>

<template>
  <main class="container acc-scope">
    <section class="section">
      <FilterBar v-model="query" :styles="styleOptions" @search="doSearch" />

      <div class="list-head">
        <h2>乌东民宿</h2>
        <span v-if="!loading && !failed" class="count">共 {{ list.length }} 家</span>
      </div>

      <div v-if="loading" class="state-note">正在加载民宿…</div>
      <div v-else-if="failed" class="state-note error">
        民宿加载失败，请稍后重试
        <button type="button" class="retry" @click="doSearch">重新加载</button>
      </div>
      <div v-else-if="list.length" class="hotel-grid">
        <HotelCard v-for="h in list" :key="h.id" :hotel="h" @click="goDetail(h.id)" />
      </div>
      <p v-else class="empty-state">没有符合当前条件的民宿，换个关键词或风格试试吧。</p>
    </section>
  </main>
</template>

<style scoped>
.list-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 22px 0 14px;
}
.list-head h2 {
  margin: 0;
  font-size: 22px;
  color: var(--green-900);
}
.count {
  font-size: 13px;
  color: var(--muted);
}
.hotel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.state-note,
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
.state-note.error {
  border-color: #e6b4ad;
  color: var(--gold-600);
}
.retry {
  margin-left: 6px;
  border: 0;
  background: none;
  color: var(--green-500);
  cursor: pointer;
  text-decoration: underline;
  font-size: 13px;
}
</style>
