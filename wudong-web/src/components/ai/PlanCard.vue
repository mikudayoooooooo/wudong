<script setup lang="ts">
import { ref } from 'vue'
export interface PlanItem { icon: string; label: string; detail: string; amount: number }
export interface PlanData { id: string; name: string; tagline: string; price: number; items: PlanItem[]; note: string }
const props = defineProps<{ plan: PlanData; highlight?: boolean; booked?: boolean; bookedLabel?: string; demo?: boolean }>()
defineEmits<{ book: [] }>()
const open = ref(false)
</script>

<template>
  <div class="pcard" :class="{ hi: highlight, booked }">
    <span v-if="demo" class="demo-tag">演示数据</span>
    <div class="head" @click="open = !open">
      <b class="nm">{{ plan.id }} · {{ plan.name }}</b>
      <span class="tag">{{ plan.tagline }}</span>
      <b class="pr">¥{{ plan.price }}</b>
    </div>
    <div v-if="open" class="items">
      <div v-for="it in plan.items" :key="it.label" class="it">
        <span>{{ it.icon }} {{ it.label }}</span><i>{{ it.detail }}</i><b>¥{{ it.amount }}</b>
      </div>
      <div class="note">{{ plan.note }}</div>
    </div>
    <div v-if="booked" class="done">✅ 已预订 <code>{{ bookedLabel }}</code></div>
    <button v-else-if="highlight" class="book btn-primary" @click="$emit('book')">⚡ 一键预订</button>
  </div>
</template>

<style scoped>
.pcard { position: relative; border: 1px solid var(--line); border-radius: 10px; padding: 9px 11px; background: #fff; }
.pcard.hi { border-color: var(--green-600); box-shadow: 0 2px 10px rgba(46, 125, 50, .15); }
.pcard.booked { opacity: .85; }
.demo-tag { position: absolute; top: -8px; right: 8px; font-size: 10px; background: var(--amber-bg); color: var(--amber-text); padding: 1px 6px; border-radius: 6px; }
.head { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.nm { font-size: 13px; } .tag { font-size: 11px; color: var(--text-3); flex: 1; } .pr { color: var(--orange-500); }
.items { margin-top: 8px; border-top: 1px dashed var(--line); padding-top: 6px; display: flex; flex-direction: column; gap: 4px; }
.it { display: flex; gap: 6px; font-size: 12px; align-items: baseline; }
.it i { flex: 1; font-style: normal; color: var(--text-3); font-size: 11px; }
.note { font-size: 11px; background: var(--amber-bg); color: var(--amber-text); border-radius: 6px; padding: 4px 8px; }
.book { width: 100%; margin-top: 8px; }
.done { margin-top: 6px; font-size: 12px; color: var(--ok-text); background: var(--ok-bg); border-radius: 6px; padding: 4px 8px; }
</style>
