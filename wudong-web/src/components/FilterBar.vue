<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { HotelQuery } from '@/api/types';

const props = defineProps<{ modelValue: HotelQuery; styles: string[] }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: HotelQuery): void;
  (e: 'search'): void;
}>();

// 评分 select 的可选值（字符串，含 '4.0' 补零形式）
const RATE_OPTS = ['4.5', '4.0'] as const;

/** 把数字评分规整回 select option 字符串：Number('4.0')=4 → '4.0'（保留补零），无匹配 → '' */
function ratingOption(rating: number | undefined): string {
  if (rating == null) return '';
  return RATE_OPTS.find((o) => Number(o) === rating) ?? '';
}

// 本地编辑副本：父级用 v-model 同步 modelValue；改动即发 update:modelValue，
// chips/select/回车/搜索按钮 触发 search 让父级重新查询。
const local = reactive({
  keyword: props.modelValue.keyword ?? '',
  style: props.modelValue.styleTags ?? '',
  rating: ratingOption(props.modelValue.rating),
  sort: props.modelValue.sort ?? ''
});

function buildQuery(): HotelQuery {
  const q: HotelQuery = { ...props.modelValue };
  q.keyword = local.keyword || undefined;
  q.styleTags = local.style || undefined;
  q.rating = local.rating !== '' ? Number(local.rating) : undefined;
  q.sort = local.sort || undefined;
  return q;
}
function syncModelValue(): void {
  emit('update:modelValue', buildQuery());
}
function doSearch(): void {
  syncModelValue();
  emit('search');
}
function onKeywordInput(e: Event): void {
  local.keyword = (e.target as HTMLInputElement).value;
  syncModelValue();
}
function pickStyle(s: string): void {
  local.style = local.style === s ? '' : s;
  syncModelValue();
  emit('search');
}
function onRatingChange(e: Event): void {
  local.rating = (e.target as HTMLSelectElement).value;
  syncModelValue();
  emit('search');
}
function onSortChange(e: Event): void {
  local.sort = (e.target as HTMLSelectElement).value;
  syncModelValue();
  emit('search');
}

// 父级（如 URL 解析恢复）替换 modelValue 时回填本地副本
watch(
  () => props.modelValue,
  (v) => {
    local.keyword = v.keyword ?? '';
    local.style = v.styleTags ?? '';
    local.rating = ratingOption(v.rating);
    local.sort = v.sort ?? '';
  }
);
</script>

<template>
  <div class="filters">
    <input
      class="kw"
      :value="local.keyword"
      type="text"
      placeholder="搜民宿名 / 地址"
      @input="onKeywordInput"
      @keyup.enter="doSearch"
    />
    <div class="chips">
      <button
        v-for="s in styles"
        :key="s"
        type="button"
        class="chip"
        :class="{ on: local.style === s }"
        @click="pickStyle(s)"
      >
        {{ s }}
      </button>
    </div>
    <select class="rate" aria-label="评分筛选" :value="local.rating" @change="onRatingChange">
      <option value="">评分不限</option>
      <option value="4.5">4.5+ 分</option>
      <option value="4.0">4.0+ 分</option>
    </select>
    <select class="sort" aria-label="排序方式" :value="local.sort" @change="onSortChange">
      <option value="">默认排序</option>
      <option value="rating">评分最高</option>
      <option value="price">价格从低到高</option>
      <option value="priceDesc">价格从高到低</option>
    </select>
    <button type="button" class="btn-primary search" @click="doSearch">搜索</button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px 16px;
}
.filters input,
.filters select {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
}
.kw {
  width: 210px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
}
.chip.on {
  background: var(--green-700);
  color: #fff;
  border-color: var(--green-700);
}
.btn-primary {
  margin-left: auto;
  background: var(--gold-500);
  color: #fff;
  border: 0;
  padding: 9px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(232, 150, 62, 0.35);
}
</style>
