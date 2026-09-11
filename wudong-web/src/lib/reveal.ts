import type { App, Directive } from 'vue'

/**
 * v-reveal —— 入场编排指令（规范 §3.0 A）
 * 进入视口后给元素加 .reveal-in，触发上浮淡入；只触发一次。
 * opts: v-reveal 或 v-reveal="120"（毫秒延迟）或 v-reveal="{ delay: 120 }"
 * 无障碍：prefers-reduced-motion 下 CSS 侧直接静态化（见 theme.css）。
 */
const els = new WeakMap<HTMLElement, IntersectionObserver>()

const directive: Directive<HTMLElement, number | { delay?: number } | undefined> = {
  mounted(el, binding) {
    const delay = typeof binding.value === 'number' ? binding.value : binding.value?.delay ?? 0
    if (delay) el.style.transitionDelay = `${delay}ms`
    el.classList.add('reveal')
    // 尊重系统偏好：直接显示，不观察
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('reveal-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    )
    io.observe(el)
    els.set(el, io)
  },
  unmounted(el) {
    els.get(el)?.disconnect()
    els.delete(el)
  },
}

export const registerReveal = (app: App): void => {
  app.directive('reveal', directive)
}

export default directive
