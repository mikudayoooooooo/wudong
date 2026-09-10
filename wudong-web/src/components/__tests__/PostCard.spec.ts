import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostCard from '../PostCard.vue'

const post601 = {
  id: 601,
  title: '晨雾还没散，就到了观景台',
  images: [1],
  likeCount: 328,
  commentCount: 41,
  linkedRouteId: 1,
  routeTitle: '苗寨深度两日游',
  author: { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾' },
  footprintLit: 4,
  footprintTotal: 5,
}
const post604 = {
  id: 604,
  title: '雨后的吊脚楼',
  images: [2],
  likeCount: 87,
  commentCount: 12,
  linkedRouteId: null,
  author: { id: 3, nickname: '快门手', avatar: '📷' },
  footprintLit: 0,
  footprintTotal: 0,
}

describe('PostCard', () => {
  it('渲染标题、作者与互动数', () => {
    const w = mount(PostCard, { props: { post: post601 } })
    expect(w.text()).toContain('晨雾还没散')
    expect(w.text()).toContain('山野小鱼')
    expect(w.text()).toContain('328')
  })
  it('关联路线的卡片显示可点击路线标签', async () => {
    const w = mount(PostCard, { props: { post: post601 } })
    const tag = w.find('.tag')
    expect(tag.exists()).toBe(true)
    expect(tag.text()).toContain('苗寨深度两日游')
    await tag.trigger('click')
    expect(w.emitted('tag')![0]).toEqual([1])
  })
  it('无关联路线的卡片不显示路线标签', () => {
    const w = mount(PostCard, { props: { post: post604 } })
    expect(w.find('.tag').exists()).toBe(false)
  })
  it('有足迹统计的卡片显示 MiniChain', () => {
    const w = mount(PostCard, { props: { post: post601 } })
    expect(w.findComponent({ name: 'MiniChain' }).exists()).toBe(true)
  })
  it('无足迹统计的卡片不显示 MiniChain', () => {
    const w = mount(PostCard, { props: { post: post604 } })
    expect(w.findComponent({ name: 'MiniChain' }).exists()).toBe(false)
  })
})
