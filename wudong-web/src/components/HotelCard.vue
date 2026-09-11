<script setup lang="ts">
import { computed } from 'vue';
import { fmtPrice } from '@/utils/format';
import Icon from '@/components/Icon.vue';
import type { Hotel } from '@/api/types';

const props = defineProps<{ hotel: Hotel }>();
const emit = defineEmits<{ (e: 'click'): void }>();

const coverImage = computed(() => props.hotel.mainImage || props.hotel.images?.[0] || '');

function onImgError(e: Event): void {
  const el = e.currentTarget as HTMLElement | null;
  if (el) el.style.display = 'none';
}
</script>

<template>
  <article class="hotel-card" @click="emit('click')">
    <img v-if="coverImage" class="cover" :src="coverImage" :alt="hotel.name" @error="onImgError" />
    <div v-else class="cover placeholder" aria-hidden="true"></div>
    <div class="body">
      <p class="name">{{ hotel.name }}</p>
      <p class="addr"><Icon name="map-pin" :size="12" /> {{ hotel.address }}</p>
      <div class="tags">
        <span v-for="t in hotel.styleTags.slice(0, 4)" :key="t" class="tag">{{ t }}</span>
      </div>
      <div class="meta">
        <span class="rate">★ {{ hotel.rating.toFixed(1) }}</span>
        <span class="price">¥<em>{{ hotel.minPrice == null ? '--' : fmtPrice(hotel.minPrice) }}</em>/晚起</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.hotel-card {
  background: #fff;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--line);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;
}
.hotel-card:hover {
  transform: translateY(-4px);
  border-color: var(--ind-300);
}
.cover {
  height: 170px;
  width: 100%;
  object-fit: cover;
}
.cover.placeholder {
  background: var(--ind-100);
}
.body {
  padding: 14px 16px 16px;
}
.name {
  margin: 0 0 6px;
  font-size: 17px;
  color: var(--green-900);
}
.addr {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.tag {
  font-size: 12px;
  color: var(--green-700);
  background: var(--green-100);
  border: 1px solid var(--line);
  padding: 2px 8px;
  border-radius: var(--radius);
}
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rate {
  color: var(--gold-600);
  font-weight: 600;
}
.price {
  color: var(--muted);
  font-size: 13px;
}
.price em {
  font-style: normal;
  color: var(--cinnabar);
  font-size: 20px;
  font-weight: 700;
}
</style>
