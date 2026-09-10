<script setup lang="ts">
import type { Post } from '../types'
import PostCard from './PostCard.vue'

defineProps<{ posts: Post[] }>()
const emit = defineEmits<{ open: [postId: number]; tag: [routeId: number] }>()
</script>

<template>
  <div class="waterfall">
    <PostCard v-for="p in posts" :key="p.id" :post="p" @open="(id) => emit('open', id)" @tag="(id) => emit('tag', id)" />
  </div>
</template>

<style scoped>
.waterfall { columns: 3; column-gap: 12px; }
@media (max-width: 900px) { .waterfall { columns: 2; } }
</style>
