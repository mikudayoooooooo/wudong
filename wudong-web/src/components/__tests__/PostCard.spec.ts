import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostCard from '../PostCard.vue'
import { getPost } from '../../data/mock'

describe('PostCard', () => {
  it('渲染标题、作者与互动数', () => {
    const w = mount(PostCard, { props: { post: getPost(601)! } })
    expect(w.text()).toContain('晨雾还没散')
    expect(w.text()).toContain('山野小鱼')
    expect(w.text()).toContain('328')
  })
  it('关联路线的卡片显示可点击路线标签', async () => {
    const w = mount(PostCard, { props: { post: getPost(601)! } })
    const tag = w.find('.tag')
    expect(tag.exists()).toBe(true)
    await tag.trigger('click')
    expect(w.emitted('tag')![0]).toEqual([1])
  })
  it('无关联路线的卡片不显示路线标签', () => {
    const w = mount(PostCard, { props: { post: getPost(604)! } })
    expect(w.find('.tag').exists()).toBe(false)
  })
  it('有足迹快照的卡片显示 MiniChain', () => {
    const w = mount(PostCard, { props: { post: getPost(601)! } })
    expect(w.findComponent({ name: 'MiniChain' }).exists()).toBe(true)
  })
})
