<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Banner } from '@/api/types';

const props = defineProps<{ banners: Banner[] }>();

const cur = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

// 当前展示的 banner（cur 越界时回退到首张，保证渲染安全）
const active = computed<Banner>(() => props.banners[cur.value] ?? props.banners[0]);

function turn(dir: number): void {
  if (!props.banners.length) return;
  cur.value = (cur.value + dir + props.banners.length) % props.banners.length;
}
function go(i: number): void {
  cur.value = i;
}
/** 图片加载失败 → 隐藏 img，露出容器底色占位 */
function onImgError(e: Event): void {
  const el = e.currentTarget as HTMLElement | null;
  if (el) el.style.display = 'none';
}

onMounted(() => {
  timer = setInterval(() => turn(1), 4500);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section v-if="banners.length" class="hero">
    <div class="hero-slide">
      <img v-if="active.image" :src="active.image" :alt="active.title" @error="onImgError" />
      <div class="hero-mask">
        <h1>{{ active.title }}</h1>
        <p>梯田之上 · 云雾之间 · 一座藏在苗岭的古村落</p>
      </div>
    </div>
    <button type="button" class="hero-arrow prev" aria-label="上一张" @click="turn(-1)">‹</button>
    <button type="button" class="hero-arrow next" aria-label="下一张" @click="turn(1)">›</button>
    <div class="hero-dots">
      <button
        v-for="i in banners.length"
        :key="i"
        type="button"
        :class="{ on: i - 1 === cur }"
        :aria-label="`第 ${i} 张`"
        @click="go(i - 1)"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 0 0 26px 26px;
  background: var(--green-500);
}
.hero-slide {
  position: relative;
  height: 420px;
  background: linear-gradient(135deg, var(--green-700), var(--green-500));
}
.hero-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  background: linear-gradient(180deg, rgba(18, 34, 24, 0.05), rgba(18, 34, 24, 0.72));
  color: #fff;
}
.hero-mask h1 {
  margin: 0 0 6px;
  font-size: 34px;
  letter-spacing: 1px;
}
.hero-mask p {
  margin: 0;
  font-size: 15px;
  opacity: 0.92;
}
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.86);
  color: var(--green-700);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--shadow);
}
.hero-arrow.prev {
  left: 18px;
}
.hero-arrow.next {
  right: 18px;
}
.hero-dots {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.hero-dots button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.hero-dots button.on {
  background: var(--gold-300);
  width: 22px;
  border-radius: 6px;
}
</style>
