import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RelayPanel from '../RelayPanel.vue'

describe('RelayPanel 接力面板', () => {
  it('lit=-1 三个节点全部灰置', () => {
    const w = mount(RelayPanel, { props: { lit: -1, busy: null } })
    expect(w.findAll('.node.on')).toHaveLength(0)
    expect(w.text()).toContain('需求识别')
  })
  it('lit=1 时节点 0/1 常亮、节点 2 灰置', () => {
    const w = mount(RelayPanel, { props: { lit: 1, busy: null } })
    const nodes = w.findAll('.node')
    expect(nodes[0].classes()).toContain('on')
    expect(nodes[1].classes()).toContain('on')
    expect(nodes[2].classes()).not.toContain('on')
  })
  it('busy=1 时节点 1 有 running 态（呼吸/流光）', () => {
    const w = mount(RelayPanel, { props: { lit: 0, busy: 1 } })
    expect(w.findAll('.node')[1].classes()).toContain('running')
  })
})
