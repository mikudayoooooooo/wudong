import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MiniChain from '../MiniChain.vue'

describe('MiniChain', () => {
  it('渲染 total 个点，前 lit 个为亮色', () => {
    const w = mount(MiniChain, { props: { lit: 3, total: 5 } })
    const dots = w.findAll('.dot')
    expect(dots).toHaveLength(5)
    expect(dots.filter((d) => d.classes().includes('on'))).toHaveLength(3)
  })
  it('附带 3/5 文本', () => {
    const w = mount(MiniChain, { props: { lit: 4, total: 5 } })
    expect(w.text()).toContain('4/5')
  })
})
