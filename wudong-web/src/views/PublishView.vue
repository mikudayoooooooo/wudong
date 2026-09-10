<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { communityApi } from '../api/community'

const router = useRouter()
const title = ref('')
const content = ref('')
const pickedImages = ref<number[]>([])
const pickedTopics = ref<number[]>([])
const topics = ref<any[]>([])
const toast = ref('')
const toastOk = ref(false)

async function loadTopics() {
  topics.value = await communityApi.topicList()
}
loadTopics()

function toggleImage(i: number): void {
  const at = pickedImages.value.indexOf(i)
  if (at >= 0) pickedImages.value.splice(at, 1)
  else if (pickedImages.value.length < 9) pickedImages.value.push(i)
}
function toggleTopic(id: number): void {
  const at = pickedTopics.value.indexOf(id)
  if (at >= 0) pickedTopics.value.splice(at, 1)
  else pickedTopics.value.push(id)
}

async function submit(): Promise<void> {
  if (!title.value.trim()) return alert('请填写标题')
  if (content.value.length > 5000) {
    toastOk.value = false
    toast.value = '正文不能超过 5000 字'
    return
  }
  try {
    const r = await communityApi.postAdd({
      title: title.value,
      content: content.value,
      images: pickedImages.value,
      topicIds: pickedTopics.value,
    })
    if (r.status === 'pending') {
      toastOk.value = false
      toast.value = '内容包含待复审词，已提交人工审核 ›'
      setTimeout(() => router.push('/community'), 1500)
    } else {
      toastOk.value = true
      toast.value = '发布成功 · 已自动附上你的核销足迹 ›'
      setTimeout(() => router.push(`/post/${r.id}`), 1200)
    }
  } catch (e: any) {
    toastOk.value = false
    toast.value = e?.message || '发布失败'
  }
}
</script>

<template>
  <div class="container page">
    <div class="card form">
      <h2>✏️ 发布游记</h2>
      <input v-model="title" class="title" placeholder="标题（必填）" />
      <textarea v-model="content" rows="8" placeholder="正文 ≤ 5000 字" />
      <div class="label">添加图片（{{ pickedImages.length }}/9）</div>
      <div class="imgs">
        <div
          v-for="i in 6" :key="i" class="ph opt" :class="[`ph-${i - 1}`, { picked: pickedImages.includes(i - 1) }]"
          @click="toggleImage(i - 1)"
        >{{ pickedImages.includes(i - 1) ? '✓' : '+' }}</div>
      </div>
      <div class="label">选择话题</div>
      <div class="topics">
        <span v-for="t in topics" :key="t.id" class="pill tp" :class="{ on: pickedTopics.includes(t.id) }" @click="toggleTopic(t.id)">{{ t.name }}</span>
      </div>
      <button class="btn-primary submit" @click="submit">发布</button>
      <div v-if="toast" class="toast" :class="{ ok: toastOk }">{{ toast }}</div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 680px; margin: 18px auto 40px; }
.form { padding: 18px 20px; }
h2 { margin: 0 0 12px; }
input.title, textarea { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; font: inherit; margin-bottom: 12px; box-sizing: border-box; }
.label { font-size: 12px; color: var(--text-3); margin-bottom: 6px; }
.imgs { display: flex; gap: 8px; margin-bottom: 12px; }
.opt { width: 72px; height: 54px; justify-content: center; align-items: center; cursor: pointer; opacity: .55; }
.opt.picked { opacity: 1; outline: 2px solid var(--green-600); }
.topics { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.tp { background: #f2f2f2; cursor: pointer; }
.tp.on { background: var(--green-600); color: #fff; }
.submit { width: 100%; }
.toast { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 8px 12px; font-size: 12px; margin-top: 10px; }
.toast.ok { background: var(--ok-bg); color: var(--ok-text); }
</style>
