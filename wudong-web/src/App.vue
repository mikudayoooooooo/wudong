<script setup lang="ts">
import TopNav from './components/TopNav.vue'
import AppFooter from './components/AppFooter.vue'
import AiButler from './components/ai/AiButler.vue'
</script>

<template>
  <TopNav />
  <RouterView />
  <AppFooter />
  <AiButler />
</template>
