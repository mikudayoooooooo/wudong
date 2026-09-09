<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import HeroCarousel from '../components/HeroCarousel.vue'
import FootprintMap from '../components/FootprintMap.vue'
import SectionHeader from '../components/SectionHeader.vue'
import Waterfall from '../components/Waterfall.vue'
import CountUp from '../components/CountUp.vue'
import { weeklyLeaderboard } from '../lib/stats'
import { sortPosts } from '../lib/feed'
import { getRoutes, getAllSpots, getPosts, getTopics, getUsers, getGuides, getPostFootprints } from '../data/mock'
import { routeStopsView, userLitSpotIds } from '../lib/footprint'

const router = useRouter()
const bookDate = ref('2026-09-13')
const bookPeople = ref(2)

const kingkong = [
  { icon: '🎫', label: '景区门票', to: '/scenic', disabled: false },
  { icon: '🗺️', label: '路线套餐', to: '/route', disabled: false },
  { icon: '📷', label: '社区游记', to: '/community', disabled: false },
  { icon: '🧭', label: '交通攻略', to: '/guide', disabled: false },
  { icon: '🏨', label: '民宿', to: '', disabled: true },
  { icon: '🛍️', label: '非遗好物', to: '', disabled: true },
]

// 首页地图：所有路线的站点合并去重后展示
const overviewStops = (() => {
  const seen = new Map<number, ReturnType<typeof routeStopsView>[number]>()
  for (const r of getRoutes()) for (const s of routeStopsView(r.id)) if (!seen.has(s.spotId)) seen.set(s.spotId, s)
  return [...getAllSpots()].filter((s) => seen.has(s.id)).map((s) => seen.get(s.id)!)
})()

const board = weeklyLeaderboard()
const barWidth = (i: number): string => `${Math.max((board[i].count / (board[0].count || 1)) * 100, 6)}%`

// 区块5：足迹精选（有足迹快照的游记按点赞取3）
const highlightPosts = sortPosts(getPosts(), 'recommend').filter((p) => p.linkedRouteId).slice(0, 3)
const gradOf = (i: number): string => ['linear-gradient(120deg,#7fae8e,#33523e)', 'linear-gradient(120deg,#c9a06b,#8a5f2e)', 'linear-gradient(120deg,#8e7fae,#4a3a6a)'][i % 3]
function getPostFootprintsOf(postId: number): string {
  const n = getPostFootprints(postId).filter((s) => s.status === 'normal').length
  return n > 0 ? `${n} 站点亮` : '待生成'
}

// 区块6：瀑布流 + 侧栏
const feedPosts = sortPosts(getPosts(), 'recommend')
const topicRank = [...getTopics()].sort((a, b) => b.viewCount - a.viewCount)
// 活跃旅人 = 按点亮站数排序的用户
const activeUsers = getUsers()
  .map((u) => ({ ...u, litCount: userLitSpotIds(u.id).size }))
  .sort((a, b) => b.litCount - a.litCount)
  .slice(0, 3)

// 区块7：攻略 + 平台数据
const guides = getGuides()
</script>

<template>
  <div class="container">
    <!-- 区块1：轮播 + 快捷订票 -->
    <section class="hero-row">
      <HeroCarousel class="hero" @open="(t, id) => router.push(t === 'route' ? `/route/${id}` : `/scenic/${id}`)" />
      <aside class="quick card">
        <b>🎫 快捷订票</b>
        <div class="field"><input v-model="bookDate" type="date" /></div>
        <div class="field steppers">
          <span>出行人数</span>
          <button @click="bookPeople = Math.max(1, bookPeople - 1)">−</button>
          <b>{{ bookPeople }}</b>
          <button @click="bookPeople++">＋</button>
        </div>
        <button class="btn-primary go" @click="router.push('/route')">查询路线</button>
      </aside>
    </section>

    <!-- 区块2：金刚区 -->
    <section class="kingkong">
      <div
        v-for="k in kingkong" :key="k.label" class="kk card"
        :class="{ disabled: k.disabled }"
        @click="!k.disabled && router.push(k.to)"
      >
        <b>{{ k.icon }}</b>
        <span>{{ k.label }}</span>
        <i v-if="k.disabled">即将上线</i>
      </div>
    </section>

    <!-- 区块3：手绘地图总览 -->
    <SectionHeader icon="🗺️" title="乌东村手绘地图" sub="站点大小 = 被点亮次数 · 点击直达" />
    <FootprintMap :stops="overviewStops" variant="overview" @select="(id) => router.push(`/scenic/${id}`)" />

    <!-- 区块4：足迹榜 + 节庆倒计时 -->
    <section class="board-row">
      <div class="board card">
        <SectionHeader icon="🏆" title="本周足迹榜" sub="被点亮最多的站与线" />
        <table>
          <tr v-for="(b, i) in board" :key="b.spotId">
            <td><span class="no" :class="'no-' + i">{{ i + 1 }}</span><b>{{ b.name }}</b><span class="kind"> {{ b.kind }}</span></td>
            <td class="bar-cell"><div class="bar" :style="{ width: barWidth(i) }" /></td>
            <td class="cnt">{{ b.count }} 次点亮</td>
          </tr>
        </table>
      </div>
      <aside class="festival card">
        <b>⏳ 节庆倒计时</b>
        <div class="fest">
          <b class="name">苗年 · 芦笙节</b>
          <div><span class="days">23</span> 天后开幕</div>
          <a class="link" @click="router.push('/route')">节庆主题路线已上线 ›</a>
        </div>
        <b>📢 公告</b>
        <div class="notice">· 中秋两日游余票紧张<br />· 新增广州→凯里高铁攻略</div>
      </aside>
    </section>

    <!-- 区块5：真实足迹精选 -->
    <SectionHeader icon="🧭" title="真实足迹" sub="本周点亮最完整的游记" more="进入社区" @more="router.push('/community')" />
    <section class="hl-row">
      <div v-for="(p, i) in highlightPosts" :key="p.id" class="card hl" @click="router.push(`/post/${p.id}`)">
        <div class="ph hl-img" :style="{ background: gradOf(i) }">{{ p.title }}</div>
        <div class="hl-body">
          <b>@{{ getUsers().find((u) => u.id === p.userId)?.nickname }}</b>
          <span class="sub">· {{ getRoutes().find((r) => r.id === p.linkedRouteId)?.title }}</span>
          <div class="chain-line">🧭 足迹快照 {{ getPostFootprintsOf(p.id) }} · 赞 {{ p.likeCount }}</div>
        </div>
      </div>
    </section>

    <!-- 区块6：社区瀑布流 + 侧栏 -->
    <section class="feed-row">
      <div class="feed-main">
        <div class="tabs">
          <span class="pill tab on">推荐</span><span class="pill tab">最新</span><span class="pill tab">关注</span>
          <span v-for="t in topicRank.slice(0, 3)" :key="t.id" class="pill tab">{{ t.name }}</span>
        </div>
        <Waterfall :posts="feedPosts.slice(0, 6)" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
      </div>
      <aside class="side">
        <div class="card side-card">
          <b>🔥 话题榜</b>
          <div class="side-list">
            <span v-for="t in topicRank" :key="t.id">{{ t.name }} {{ t.viewCount.toLocaleString() }}浏览</span>
          </div>
        </div>
        <div class="card side-card">
          <b>🌟 活跃旅人</b>
          <div class="side-list">
            <span v-for="u in activeUsers" :key="u.id" @click="router.push(`/user/${u.id}`)">
              {{ u.avatar }} {{ u.nickname }} · 足迹 {{ u.litCount }}/6 站
            </span>
          </div>
        </div>
        <div class="card side-card">
          <b>🎫 顺手买一票</b>
          <div class="side-list"><span>苗寨深度两日游 ¥899 ›</span></div>
        </div>
      </aside>
    </section>

    <!-- 区块7：交通攻略 + 平台数据 -->
    <section class="serv-row">
      <div class="card guides">
        <b>🚄 怎么来乌东？</b>
        <div class="guide-cards">
          <div v-for="g in guides" :key="g.id" class="g-card">
            <b>{{ g.departure }}出发</b><br />{{ g.transportType }} {{ g.duration }}<br />
            <b class="cost">约 ¥{{ g.cost }}</b>
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><CountUp :value="52318" /><span>张电子票已核销</span></div>
        <div class="stat"><CountUp :value="186542" /><span>次足迹点亮</span></div>
        <div class="stat"><CountUp :value="98" suffix="%" /><span>行程完成率</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-row { display: flex; gap: 12px; margin-top: 16px; }
.hero { flex: 1; }
.quick { width: 240px; padding: 12px; background: var(--paper); }
.field { margin: 8px 0; }
.field input { width: 100%; border: 1px solid var(--line); border-radius: 6px; padding: 6px 8px; }
.steppers { display: flex; align-items: center; gap: 8px; }
.steppers button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--line); background: #fff; }
.go { width: 100%; margin-top: 6px; }
.kingkong { display: flex; gap: 10px; margin: 16px 0; }
.kk { flex: 1; text-align: center; padding: 10px 0 8px; cursor: pointer; background: #f7f9f6; border-color: #e8efe9; }
.kk b { font-size: 20px; display: block; }
.kk span { font-size: 12px; }
.kk i { display: block; font-style: normal; font-size: 10px; color: #bbb; }
.kk.disabled { opacity: .55; cursor: default; }
.board-row { display: flex; gap: 12px; margin-top: 6px; }
.board { flex: 1; padding: 0 14px 10px; }
.board table { width: 100%; border-collapse: collapse; font-size: 12px; }
.board td { padding: 6px 4px; border-bottom: 1px dashed var(--line-soft); }
.no { display: inline-flex; width: 20px; height: 20px; border-radius: 6px; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 800; background: #ddd; margin-right: 6px; }
.no-0 { background: var(--orange-500); } .no-1 { background: #eda75a; } .no-2 { background: #c9b37e; }
.kind { color: var(--text-3); font-size: 11px; }
.bar-cell { width: 40%; }
.bar { height: 8px; border-radius: 4px; background: linear-gradient(90deg, var(--orange-500), var(--orange-300)); }
.cnt { color: var(--amber-text); font-weight: 700; white-space: nowrap; }
.festival { width: 260px; padding: 12px 14px; background: var(--paper); font-size: 12px; }
.fest { margin: 6px 0 12px; padding: 8px; background: #fff; border: 1px solid var(--line-soft); border-radius: 8px; }
.days { font-size: 22px; font-weight: 800; color: var(--orange-700); }
.link { color: var(--amber-text); cursor: pointer; font-size: 11px; }
.notice { color: var(--text-3); margin-top: 4px; }
.hl-row { display: flex; gap: 12px; }
.hl { flex: 1; cursor: pointer; }
.hl-img { height: 86px; border-radius: 0; font-size: 13px; font-weight: 600; }
.hl-body { padding: 8px 10px; font-size: 12px; }
.chain-line { color: var(--amber-text); font-size: 11px; margin-top: 4px; }
.feed-row { display: flex; gap: 12px; margin-top: 6px; }
.feed-main { flex: 1; }
.tabs { display: flex; gap: 8px; margin-bottom: 10px; font-size: 12px; }
.tab { background: #f2f2f2; cursor: pointer; }
.tab.on { background: var(--green-600); color: #fff; }
.side { width: 240px; display: flex; flex-direction: column; gap: 12px; }
.side-card { padding: 10px 12px; font-size: 12px; background: var(--paper); }
.side-list { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; color: var(--text-2); }
.side-list span { cursor: pointer; }
.serv-row { display: flex; gap: 12px; margin: 18px 0 30px; }
.guides { flex: 1.3; padding: 12px 14px; }
.guide-cards { display: flex; gap: 8px; margin-top: 8px; }
.g-card { flex: 1; background: #f7f9f6; border-radius: 8px; padding: 8px; font-size: 11px; }
.cost { color: var(--orange-700); }
.stats { flex: 1; display: flex; gap: 10px; }
.stat { flex: 1; background: var(--green-900); color: #fff; border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; padding: 12px 0; }
</style>
