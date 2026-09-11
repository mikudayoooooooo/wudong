<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../../stores/session'
import { getMyOrders, cancelOrder } from '../../api/order'
import { reviewAdd } from '../../api/personal'
import Icon from '../../components/Icon.vue'
import { productReviewAdd } from '../../api/product'

const router = useRouter()
const session = useSession()
const loading = ref(true)
const list = ref<any[]>([])
const status = ref<number>(0)
const page = ref(1)
const size = 10
const total = ref(0)

const STATUS_TABS = [
  { label: '全部', value: 0 },
  { label: '待支付', value: 1 },
  { label: '已支付', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已取消', value: 4 },
  { label: '已退款', value: 5 },
]

const STATUS_DICT: Record<number, { label: string; cls: string }> = {
  1: { label: '待支付', cls: 'st-warn' },
  2: { label: '已支付', cls: 'st-ok' },
  3: { label: '已完成', cls: 'st-ok' },
  4: { label: '已取消', cls: 'st-off' },
  5: { label: '已退款', cls: 'st-off' },
}

const MODULE_DICT: Record<string, string> = {
  product: '衣·商品',
  food: '食·餐位',
  accommodation: '住·民宿',
  travel: '行·票务',
}

// 已完成才可评：行·票务（scenic/route）与商品有 C 端评价接口
const reviewable = (o: any) =>
  o.status === 3 && (o.module === 'travel' || o.module === 'product')

async function load() {
  loading.value = true
  try {
    const r = await getMyOrders(status.value || undefined, page.value, size)
    list.value = r.list || []
    total.value = r.total || 0
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  if (p < 1 || (total.value && p > Math.ceil(total.value / size))) return
  page.value = p
  load()
}

async function onCancel(o: any) {
  if (!window.confirm(`确认取消订单 ${o.orderNo}？`)) return
  try {
    await cancelOrder(o.orderNo)
    await load()
  } catch (e: any) {
    alert(e?.message || '取消失败')
  }
}

// 评价弹窗
const review = ref<{ open: boolean; order: any; rating: number; content: string }>({
  open: false,
  order: null,
  rating: 5,
  content: '',
})

function openReview(o: any) {
  review.value = { open: true, order: o, rating: 5, content: '' }
}

async function submitReview() {
  const o = review.value.order
  const items = o.items || []
  const target = items[0] || {}
  try {
    if (o.module === 'product') {
      await productReviewAdd({
        productId: target.productId,
        orderId: o.id,
        rating: review.value.rating,
        content: review.value.content,
      })
    } else {
      await reviewAdd({
        targetType: target.ticketType === 2 ? 'route' : 'scenic',
        targetId: target.targetId,
        rating: review.value.rating,
        content: review.value.content,
        orderNo: o.orderNo,
      })
    }
    alert('评价成功')
    review.value.open = false
  } catch (e: any) {
    alert(e?.message || '评价失败')
  }
}

onMounted(async () => {
  if (!session.isLogged) {
    alert('请先在右上角登录后查看订单')
    return
  }
  await load()
})
</script>

<template>
  <div class="container page">
    <h2><Icon name="ticket" :size="16" /> 我的订单</h2>

    <div class="tabs">
      <button
        v-for="t in STATUS_TABS"
        :key="t.value"
        class="tab"
        :class="{ active: status === t.value }"
        @click="status = t.value; page = 1; load()"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="!session.isLogged" class="card empty"><Icon name="ticket" :size="16" /> 请先在右上角登录后查看订单</div>
    <div v-else-if="loading" class="card empty">加载中…</div>
    <div v-else-if="!list.length" class="card empty"><Icon name="ticket" :size="16" /> 暂无订单</div>
    <div v-else class="orders">
      <div v-for="o in list" :key="o.id" class="order">
        <div class="row1">
          <b>{{ MODULE_DICT[o.module] || o.module }}</b>
          <span :class="STATUS_DICT[o.status]?.cls">{{ STATUS_DICT[o.status]?.label || o.status }}</span>
        </div>
        <div class="row2">
          <span class="no">{{ o.orderNo }}</span>
          <span>¥{{ o.payAmount }}</span>
        </div>
        <div class="row3">
          <span>{{ (o.items || []).map((i: any) => i.targetName || i.productName).filter(Boolean).join('、') || '—' }}</span>
          <span class="time">{{ o.createTime }}</span>
        </div>
        <div class="acts">
          <button class="mini" @click="router.push(`/order/${o.orderNo}`)">详情</button>
          <button v-if="o.status === 1" class="mini" @click="onCancel(o)">取消</button>
          <button v-if="reviewable(o)" class="mini primary" @click="openReview(o)">评价</button>
        </div>
      </div>

      <div v-if="total > size" class="pager">
        <button class="mini" :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
        <span class="pinfo">{{ page }} / {{ Math.ceil(total / size) }}</span>
        <button class="mini" :disabled="page >= Math.ceil(total / size)" @click="goPage(page + 1)">下一页</button>
      </div>
    </div>

    <!-- 评价弹窗 -->
    <div v-if="review.open" class="mask" @click.self="review.open = false">
      <div class="dialog card">
        <h3>评价</h3>
        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ on: n <= review.rating }"
            @click="review.rating = n"
          >★</span>
        </div>
        <textarea v-model="review.content" rows="3" maxlength="500" placeholder="说说这次体验吧（选填）" />
        <div class="d-acts">
          <button class="mini" @click="review.open = false">取消</button>
          <button class="mini primary" @click="submitReview">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.tab { border: 1px solid var(--line-soft); background: #fff; border-radius: 14px; padding: 4px 14px; cursor: pointer; color: var(--text-2); }
.tab.active { background: var(--ind-700); border-color: var(--ind-700); color: var(--paper); font-weight: 700; }
.orders { display: flex; flex-direction: column; }
.order { padding: 12px 4px; border-bottom: 1px solid var(--line-soft); }
.row1 { display: flex; justify-content: space-between; align-items: center; }
.row1 .st-warn, .row1 .st-ok, .row1 .st-off { font-size: 12px; padding: 2px 8px; border-radius: 2px; }
.row2 { display: flex; justify-content: space-between; margin: 6px 0; }
.row2 .no { color: var(--text-3); font-size: 12px; }
.row3 { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; color: var(--text-2); }
.row3 .time { color: var(--text-3); font-size: 12px; white-space: nowrap; }
.st-warn { color: var(--cinnabar-700); background: var(--cinnabar-100); font-weight: 700; }
.st-ok { color: var(--ind-700); background: var(--ind-100); font-weight: 700; }
.st-off { color: var(--text-3); }
.acts { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
.mini { border: 1px solid var(--line-soft); background: #fff; border-radius: var(--radius); padding: 3px 12px; cursor: pointer; font-size: 12px; }
.mini.primary { background: var(--ind-700); color: var(--paper); border-color: var(--ind-700); }
.mask { position: fixed; inset: 0; background: rgba(11, 29, 44, .35); display: flex; align-items: center; justify-content: center; z-index: 50; }
.dialog { width: 420px; padding: 18px; }
.stars { margin: 10px 0; font-size: 22px; }
.star { cursor: pointer; color: var(--line); }
.star.on { color: var(--cinnabar); }
textarea { width: 100%; box-sizing: border-box; border: 1px solid var(--line-soft); border-radius: 8px; padding: 8px; }
.d-acts { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.pager { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 8px 0; }
.pinfo { font-size: 12px; color: var(--text-3); }
</style>
