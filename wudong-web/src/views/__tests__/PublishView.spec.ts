import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PublishView from '../PublishView.vue'
import { useSession } from '../../stores/session'

const postAdd = vi.fn(async () => ({ id: 605, status: 'normal' }))

vi.mock('../../api/community', () => ({
  communityApi: {
    topicList: vi.fn(async () => [{ id: 501, name: '#苗寨风光' }]),
    postAdd: (...a: any[]) => (postAdd as any)(...a),
  },
}))

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/publish', component: PublishView }] })

describe('PublishView', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    postAdd.mockResolvedValue({ id: 605, status: 'normal' })
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾', bio: '' }
    await router.push('/publish'); await router.isReady()
  })
  it('发布零路线步骤：表单只有标题/正文/图/话题', () => {
    const w = mount(PublishView, { global: { plugins: [router] } })
    expect(w.text()).not.toContain('选择关联路线')
  })
  it('发布成功调用 postAdd 并提示足迹已附上', async () => {
    const w = mount(PublishView, { global: { plugins: [router] } })
    await flushPromises()
    await w.find('input.title').setValue('测试游记')
    await w.find('textarea').setValue('内容')
    await w.find('.submit').trigger('click')
    await flushPromises()
    expect(postAdd).toHaveBeenCalledWith({ title: '测试游记', content: '内容', images: [], topicIds: [] })
    expect(w.text()).toContain('发布成功')
  })
  it('正文超 5000 字拦截', async () => {
    const w = mount(PublishView, { global: { plugins: [router] } })
    await flushPromises()
    await w.find('input.title').setValue('超长')
    await w.find('textarea').setValue('字'.repeat(5001))
    await w.find('.submit').trigger('click')
    expect(w.text()).toContain('正文不能超过 5000 字')
    expect(postAdd).not.toHaveBeenCalled()
  })
  it('机审待复审时展示审核中提示', async () => {
    postAdd.mockResolvedValue({ id: 606, status: 'pending' })
    const w = mount(PublishView, { global: { plugins: [router] } })
    await flushPromises()
    await w.find('input.title').setValue('待审T')
    await w.find('textarea').setValue('x')
    await w.find('.submit').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('人工审核')
  })
})
