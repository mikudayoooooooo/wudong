<script setup lang="ts">
import Icon from './Icon.vue'

// 全局页脚（规范 §3.0 D.4）：ind-950 底 + meander 纹样，与首页深色收尾带连成一体
</script>

<template>
  <footer v-reveal class="app-footer">
    <div class="container foot-row">
      <div class="brand">
        <b class="seal-logo" aria-hidden="true">乌</b>
        <div class="brand-txt">
          <b class="brand-name font-display">乌东文旅</b>
          <p class="slogan">脚步慢一点，等灵魂跟上来</p>
          <p class="intro">雷公山麓百年苗寨——蜡染银饰、梯田云海、长桌宴与节庆，四季有歌。</p>
        </div>
      </div>

      <nav class="cols" aria-label="站点导航">
        <div class="col">
          <b>游乌东</b>
          <RouterLink to="/route">行订票</RouterLink>
          <RouterLink to="/scenic">景区门票</RouterLink>
          <RouterLink to="/hotels">住宿民宿</RouterLink>
          <RouterLink to="/guide">交通攻略</RouterLink>
        </div>
        <div class="col">
          <b>吃与逛</b>
          <RouterLink to="/restaurants">特色餐厅</RouterLink>
          <RouterLink to="/farm-products">新鲜农产品</RouterLink>
          <RouterLink to="/products">非遗好物</RouterLink>
          <RouterLink to="/community">社区游记</RouterLink>
        </div>
      </nav>

      <div class="meta">
        <b class="meta-title"><Icon name="photo" :size="14" /> 素材与版权</b>
        <a href="https://github.com/mikudayoooooooo/wudong/blob/main/wudong-web/CREDITS.md" target="_blank" rel="noopener">CREDITS · 素材出处清单</a>
        <span>实景图当前仅作个人学习用途，商用前须替换为正版授权</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--ind-950) url("../assets/pattern/meander-dark.svg") center/720px repeat;
  color: var(--ind-100);
  border-top: 1px solid rgba(251, 247, 238, .14);
  padding: 40px 0 48px;
  margin-top: 0; /* 首页与深色收尾带连成一体，其余页面紧跟内容 */
}
.foot-row { display: flex; gap: 48px; align-items: flex-start; }

.brand { flex: 1.2; display: flex; gap: 14px; }
.seal-logo { flex: none; width: 34px; height: 34px; display: grid; place-items: center; background: var(--cinnabar); color: var(--paper); font-size: 17px; border-radius: 2px; transform: rotate(-4deg); }
.brand-name { color: var(--paper); font-size: 16px; display: block; }
.slogan { font-family: var(--font-accent); font-size: 15px; color: var(--paper); margin: 8px 0 6px; letter-spacing: .02em; }
.intro { font-size: 12px; line-height: 1.8; opacity: .78; max-width: 320px; }

.cols { flex: 1; display: flex; }
.col { display: flex; flex-direction: column; gap: 9px; font-size: 12px; }
.col + .col { margin-left: 32px; padding-left: 32px; border-left: 1px solid rgba(251, 247, 238, .14); }
.col b { color: var(--paper); font-size: 12px; margin-bottom: 2px; }
.col a { color: var(--ind-100); opacity: .82; width: fit-content; }
.col a:hover { opacity: 1; }

.meta { flex: .9; display: flex; flex-direction: column; gap: 8px; font-size: 11px; line-height: 1.7; }
.meta-title { display: flex; align-items: center; gap: 6px; color: var(--paper); font-size: 12px; }
.meta a { color: var(--cinnabar-300); width: fit-content; }
.meta span { opacity: .6; }

@media (max-width: 900px) {
  .foot-row { flex-direction: column; gap: 28px; }
  .meta { flex: none; }
}
</style>
