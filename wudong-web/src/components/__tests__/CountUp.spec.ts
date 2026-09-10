import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CountUp from '../CountUp.vue'

describe('CountUp', () => {
  it('1.2s 后滚动到目标值', async () => {
    vi.useFakeTimers()
    const t0 = performance.now()
    let frame = 0
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { setTimeout(() => cb(t0 + (frame += 1) * 100), 100); return 1 })
    const w = mount(CountUp, { props: { value: 1000 } })
    await vi.advanceTimersByTimeAsync(1500)
    expect(w.text()).toContain('1,000')
    raf.mockRestore(); vi.useRealTimers()
  })
})
