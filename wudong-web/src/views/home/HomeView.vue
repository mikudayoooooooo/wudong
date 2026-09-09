<script setup lang="ts">
// Task 4 将替换为真实首页（轮播 / 公告 / 精选民宿 / 预订占位 CTA）
</script>

<template>
  <main class="container">
    <section class="section">
      <div class="section-title">
        <h2>精选民宿</h2>
        <span class="more">查看全部 →</span>
      </div>
      <p class="empty-state">民宿内容接入中，敬请期待（页面骨架已就绪）。</p>
    </section>
  </main>
</template>

<style scoped>
.empty-state {
  margin: 40px 0;
  padding: 32px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
</style>
