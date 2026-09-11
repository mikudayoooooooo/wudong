<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import HeroCarousel from '../components/HeroCarousel.vue'
import FootprintMap from '../components/FootprintMap.vue'
import SectionHeader from '../components/SectionHeader.vue'
import Waterfall from '../components/Waterfall.vue'
import CountUp from '../components/CountUp.vue'
import Icon from '../components/Icon.vue'
import { travelApi, type StopView } from '../api/travel'
import { communityApi } from '../api/community'
import { operateApi } from '../api/operate'
import imgWaterfall from '../assets/img/scenic/waterfall.jpg'
import imgLakeCabin from '../assets/img/scenic/lake-cabin.jpg'
import imgForest from '../assets/img/scenic/forest.jpg'

const router = useRouter()
const bookDate = ref('2026-09-13')
const bookPeople = ref(2)

const kingkong = [
  { icon: 'ticket', label: '景区门票', to: '/scenic', disabled: false },
  { icon: 'map-pins', label: '路线套餐', to: '/route', disabled: false },
  { icon: 'bed', label: '住宿民宿', to: '/hotels', disabled: false },
  { icon: 'gift', label: '非遗好物', to: '/products', disabled: false },
  { icon: 'tools-kitchen-2', label: '特色餐厅', to: '/restaurants', disabled: false },
  { icon: 'basket', label: '新鲜农产品', to: '/farm-products', disabled: false },
  { icon: 'camera', label: '社区游记', to: '/community', disabled: false },
  { icon: 'compass', label: '交通攻略', to: '/guide', disabled: false },
]

// 真实足迹精选封面（本地实景，Unsplash License，见 CREDITS.md）
const hlImgs = [imgWaterfall, imgLakeCabin, imgForest]

// —— 异步数据 ——
const overviewStops = ref<StopView[]>([])
const board = ref<{ spotId: number; name: string; kind: string; count: number }[]>([])
const highlightPosts = ref<any[]>([])
const feedPosts = ref<any[]>([])
const topicRank = ref<any[]>([])
const activeUsers = ref<any[]>([])
const guides = ref<any[]>([])
const announcements = ref<any[]>([])
const routeTitleMap = ref(new Map<number, string>())

const KIND: Record<string, string> = { spot: '景区', dining: '餐饮 · 食', stay: '住宿 · 住', experience: '体验' }

onMounted(async () => {
  // 第一波：全部独立请求并行
  const [routes, scenicList, feed, topicList, guideList, annList] = await Promise.all([
    travelApi.routeList(),
    travelApi.scenicList(),
    communityApi.feed('recommend', 1, 30),
    communityApi.topicList(),
    travelApi.guideList(),
    operateApi.announcements(),
  ])
  routeTitleMap.value = new Map(routes.map((r) => [r.id, r.title]))
  const spotMap = new Map(scenicList.map((s) => [s.id, s]))

  // 区块3 地图总览 + 区块4 足迹榜：各路线行程站点合并（后端已算点亮数）
  const details = await Promise.all(routes.map((r) => travelApi.routeDetail(r.id)))
  const seen = new Map<number, StopView>()
  for (const d of details) {
    for (const s of d.stops || []) {
      if (!seen.has(s.spotId)) {
        seen.set(s.spotId, {
          ...s,
          name: s.name || spotMap.get(s.spotId)?.name,
          type: spotMap.get(s.spotId)?.type,
        })
      }
    }
  }
  overviewStops.value = [...seen.values()]
  board.value = overviewStops.value
    .map((s) => ({
      spotId: s.spotId,
      name: s.name || `站点${s.spotId}`,
      kind: KIND[(s as any).type] || '景区',
      count: s.lightCount || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 区块5/6：信息流
  feedPosts.value = feed.list.map((p) => ({
    ...p,
    routeTitle: p.linkedRouteId ? routeTitleMap.value.get(p.linkedRouteId) : undefined,
  }))
  highlightPosts.value = feedPosts.value.filter((p) => p.linkedRouteId).slice(0, 3)

  // 侧栏
  topicRank.value = [...topicList].sort((a, b) => b.viewCount - a.viewCount)
  const authors: any[] = []
  for (const p of feedPosts.value) {
    if (!authors.find((u) => u.id === p.author.id)) authors.push(p.author)
    if (authors.length >= 3) break
  }
  // 第三波：活跃旅人档案并行
  activeUsers.value = await Promise.all(
    authors.map(async (u) => {
      const prof = await communityApi.userProfile(u.id)
      return { ...u, litCount: prof?.litCount ?? 0 }
    })
  )

  // 区块7 攻略 + 公告
  guides.value = guideList
  announcements.value = annList.slice(0, 3)
})

const barWidth = (i: number): string =>
  `${Math.max(((board.value[i]?.count || 0) / (board.value[0]?.count || 1)) * 100, 6)}%`
</script>

<template>
  <div class="container">
    <!-- 区块1：轮播 + 快捷订票 -->
    <section class="hero-row">
      <HeroCarousel class="hero" @open="(t, id) => router.push(t === 'route' ? `/route/${id}` : `/scenic/${id}`)" />
      <aside class="quick card">
        <b class="quick-title"><Icon name="ticket" :size="16" /> 快捷订票</b>
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
        <b class="kk-ic"><Icon :name="k.icon" :size="22" /></b>
        <span>{{ k.label }}</span>
        <i v-if="k.disabled">即将上线</i>
      </div>
    </section>

    <!-- 区块3：手绘地图总览 -->
    <SectionHeader icon="map-pins" title="乌东村手绘地图" sub="站点大小 = 被点亮次数 · 点击直达" />
    <FootprintMap :stops="overviewStops" variant="overview" @select="(id) => router.push(`/scenic/${id}`)" />

    <!-- 区块4：足迹榜 + 节庆倒计时 -->
    <section class="board-row">
      <div class="board card">
        <SectionHeader icon="flag" title="本周足迹榜" sub="被点亮最多的站与线" />
        <table>
          <tr v-for="(b, i) in board" :key="b.spotId">
            <td><span class="no" :class="'no-' + i">{{ i + 1 }}</span><b>{{ b.name }}</b><span class="kind"> {{ b.kind }}</span></td>
            <td class="bar-cell"><div class="bar" :style="{ width: barWidth(i) }" /></td>
            <td class="cnt">{{ b.count }} 次点亮</td>
          </tr>
        </table>
      </div>
      <aside class="festival card">
        <b class="fest-title"><Icon name="clock" :size="15" /> 节庆倒计时</b>
        <div class="fest">
          <b class="name">苗年 · 芦笙节</b>
          <div><span class="days">23</span> 天后开幕</div>
          <a class="link" @click="router.push('/route')">节庆主题路线已上线 ›</a>
        </div>
        <b class="fest-title"><Icon name="info-circle" :size="15" /> 公告</b>
        <div class="notice">
          <template v-if="announcements.length">
            <div v-for="a in announcements" :key="a.id">· {{ a.title }}</div>
          </template>
          <template v-else>· 暂无公告</template>
        </div>
      </aside>
    </section>

    <!-- 区块5：真实足迹精选 -->
    <SectionHeader icon="compass" title="真实足迹" sub="本周点亮最完整的游记" more="进入社区" @more="router.push('/community')" />
    <section class="hl-row">
      <div v-for="(p, i) in highlightPosts" :key="p.id" class="card hl" @click="router.push(`/post/${p.id}`)">
        <div class="hl-img img-frame">
          <img :src="hlImgs[i % hlImgs.length]" :alt="p.title" />
          <b class="hl-title">{{ p.title }}</b>
        </div>
        <div class="hl-body">
          <b>@{{ p.author?.nickname }}</b>
          <span class="sub">· {{ routeTitleMap.get(p.linkedRouteId) }}</span>
          <div class="chain-line">足迹快照 {{ p.footprintLit }}/{{ p.footprintTotal || p.footprintLit }} 站点亮 · 赞 {{ p.likeCount }}</div>
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
          <b class="side-title"><Icon name="message-circle" :size="15" /> 话题榜</b>
          <div class="side-list">
            <span v-for="t in topicRank" :key="t.id">{{ t.name }} {{ Number(t.viewCount).toLocaleString() }}浏览</span>
          </div>
        </div>
        <div class="card side-card">
          <b class="side-title"><Icon name="users" :size="15" /> 活跃旅人</b>
          <div class="side-list">
            <span v-for="u in activeUsers" :key="u.id" @click="router.push(`/user/${u.id}`)">
              {{ u.avatar }} {{ u.nickname }} · 足迹 {{ u.litCount }}/6 站
            </span>
          </div>
        </div>
        <div class="card side-card">
          <b class="side-title"><Icon name="ticket" :size="15" /> 顺手买一票</b>
          <div class="side-list"><span @click="router.push('/route/1')" style="cursor:pointer">苗寨深度两日游 ¥899 ›</span></div>
        </div>
      </aside>
    </section>

    <!-- 区块7：交通攻略 + 平台数据 -->
    <section class="serv-row">
      <div class="card guides">
        <b class="side-title"><Icon name="bus" :size="15" /> 怎么来乌东？</b>
        <div class="guide-cards">
          <div v-for="g in guides" :key="g.id" class="g-card">
            <b>{{ g.departure }}出发</b><br />{{ g.transportType }} {{ g.duration }}<br />
            <b class="cost">约 ¥{{ Number(g.cost) }}</b>
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
.quick { width: 240px; padding: 14px; background: var(--paper); }
.quick-title, .fest-title, .side-title { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ind-800); }
.field { margin: 8px 0; }
.field input { width: 100%; border: 1px solid var(--line); border-radius: var(--radius); padding: 6px 8px; background: #fff; }
.steppers { display: flex; align-items: center; gap: 8px; }
.steppers button { width: 24px; height: 24px; border-radius: var(--radius); border: 1px solid var(--line); background: #fff; }
.go { width: 100%; margin-top: 6px; }
.kingkong { display: flex; gap: 10px; margin: 16px 0; }
.kk { flex: 1; text-align: center; padding: 12px 0 10px; cursor: pointer; background: #fff; transition: background .15s; }
.kk:hover { background: var(--ind-50); }
.kk-ic { display: flex; justify-content: center; color: var(--ind-700); margin-bottom: 4px; }
.kk span { font-size: 12px; }
.kk i { display: block; font-style: normal; font-size: 10px; color: var(--text-3); }
.kk.disabled { opacity: .55; cursor: not-allowed; }
.board-row { display: flex; gap: 12px; margin: 16px 0; }
.board { flex: 1.6; padding: 12px 16px; }
.board table { width: 100%; border-collapse: collapse; font-size: 13px; }
.board td { padding: 5px 0; }
.board .bar-cell { width: 40%; }
.board .bar { height: 6px; background: var(--ind-500); border-radius: 3px; }
.board .cnt { color: var(--text-3); font-size: 12px; text-align: right; }
.no { display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 2px; background: var(--ind-100); color: var(--ind-700); margin-right: 8px; font-size: 11px; }
.no-0 { background: var(--cinnabar); color: var(--paper); }
.no-1 { background: var(--ind-700); color: var(--paper); }
.no-2 { background: var(--ind-500); color: var(--paper); }
.kind { color: var(--text-3); font-size: 11px; }
.festival { flex: 1; padding: 12px 16px; }
.fest { margin: 8px 0 14px; }
.days { font-size: 26px; font-weight: 700; font-family: var(--font-display); color: var(--cinnabar); }
.link { color: var(--cinnabar-700); font-size: 12px; cursor: pointer; }
.notice { font-size: 12px; color: var(--text-2); line-height: 1.8; }
.hl-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.hl { overflow: hidden; cursor: pointer; }
.hl-img { height: 130px; }
.hl-title { position: absolute; left: 10px; bottom: 8px; z-index: 1; color: var(--paper); font-size: 14px; }
.hl-body { padding: 10px 12px; font-size: 12px; }
.chain-line { color: var(--text-3); margin-top: 4px; font-size: 11px; }
.feed-row { display: flex; gap: 12px; margin-top: 16px; }
.feed-main { flex: 1; }
.tabs { display: flex; gap: 8px; margin-bottom: 10px; }
.tab { background: #fff; border: 1px solid var(--line); cursor: pointer; }
.tab.on { background: var(--ind-700); border-color: var(--ind-700); color: var(--paper); }
.side { width: 240px; display: flex; flex-direction: column; gap: 12px; }
.side-card { padding: 12px 14px; }
.side-list { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--text-2); margin-top: 8px; }
.side-list span { cursor: pointer; }
.serv-row { display: flex; gap: 12px; margin: 16px 0 30px; }
.guides { flex: 1.4; padding: 12px 16px; }
.guide-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; font-size: 12px; }
.g-card { background: var(--ind-50); border-radius: var(--radius); padding: 8px 10px; line-height: 1.7; }
.cost { color: var(--cinnabar-700); }
.stats { flex: 1; display: flex; gap: 10px; }
.stat { flex: 1; background: var(--ind-800); color: var(--paper); border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 12px; }
.stat :deep(.num), .stat b { font-family: var(--font-display); letter-spacing: -0.02em; }
</style>
