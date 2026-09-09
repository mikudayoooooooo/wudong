import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PublishView from '../PublishView.vue'
import { useSession } from '../../stores/session'
import { getPosts, getPostFootprints, __mockWritable } from '../../data/mock'

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/publish', component: PublishView }] })

describe('PublishView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 还原测试新增的帖子/足迹，避免污染其他用例（原地截断保持数组引用，getPosts 才能看到发布结果）
    const keepPosts = __mockWritable.posts.filter((p) => p.id <= 700)
    __mockWritable.posts.splice(0, __mockWritable.posts.length, ...keepPosts)
    const keepFps = __mockWritable.postFootprints.filter((f) => f.postId <= 700)
    __mockWritable.postFootprints.splice(0, __mockWritable.postFootprints.length, ...keepFps)
  })
  it('发布零路线步骤：表单只有标题/正文/图/话题', async () => {
    await router.push('/publish'); await router.isReady()
    const w = mount(PublishView, { global: { plugins: [router] } })
    expect(w.text()).not.toContain('选择关联路线')
  })
  it('发布成功后生成模式A足迹快照（来自核销记录）', async () => {
    useSession().login()
    await router.push('/publish'); await router.isReady()
    const w = mount(PublishView, { global: { plugins: [router] } })
    await w.find('input.title').setValue('测试游记')
    await w.find('textarea').setValue('内容')
    await w.find('.submit').trigger('click')
    await new Promise((r) => setTimeout(r, 50))
    const created = getPosts().find((p) => p.title === '测试游记')!
    expect(created).toBeTruthy()
    const fps = getPostFootprints(created.id)
    expect(fps.length).toBeGreaterThan(0)
    expect(fps.every((f) => f.mode === 'auto')).toBe(true)
  })
  it('正文超 5000 字拦截', async () => {
    useSession().login()
    await router.push('/publish'); await router.isReady()
    const w = mount(PublishView, { global: { plugins: [router] } })
    await w.find('input.title').setValue('超长')
    await w.find('textarea').setValue('字'.repeat(5001))
    await w.find('.submit').trigger('click')
    expect(w.text()).toContain('正文不能超过 5000 字')
    expect(getPosts().some((p) => p.title === '超长')).toBe(false)
  })
})
