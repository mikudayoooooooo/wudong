import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import AiButler from '../AiButler.vue'
import { useSession } from '../../../stores/session'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/' }),
}))

const accBooking = vi.fn(async () => ({ orderNo: 'WD-ACC-1', payAmount: 632, nights: ['2026-10-01', '2026-10-02'] }))
const foodResv = vi.fn(async () => ({ id: 9 }))
const travelBooking = vi.fn(async () => ({ orderNo: 'WD-TKT-1', payAmount: 598, ticketIds: [1, 2] }))
const payCreate = vi.fn(async () => ({ paymentNo: 'PAY-1' }))
const payMock = vi.fn(async () => true)

vi.mock('../../../api/accommodation', () => ({ bookingCreate: (...a: any[]) => (accBooking as any)(...a) }))
vi.mock('../../../api/food', () => ({
  createReservation: (...a: any[]) => (foodResv as any)(...a),
  searchRestaurants: vi.fn(), restaurantDetail: vi.fn(), getAvailableTimeSlots: vi.fn(),
  searchFarmProducts: vi.fn(), farmProductDetail: vi.fn(), getFarmProductCategories: vi.fn(),
}))
vi.mock('../../../api/travel', () => ({ travelApi: { bookingCreate: (...a: any[]) => (travelBooking as any)(...a) } }))
vi.mock('../../../api/operate', () => ({
  operateApi: {},
  orderApi: { payCreate: (...a: any[]) => (payCreate as any)(...a), payMock: (...a: any[]) => (payMock as any)(...a) },
}))

const tick = () => new Promise((r) => setTimeout(r, 0))
async function settle(_w: any, rounds = 30) {
  for (let i = 0; i < rounds; i++) { await flushPromises(); await tick() }
}
async function openButler() {
  const w = mount(AiButler, { props: { pacing: 0 } })
  await w.find('.fab').trigger('click')
  await settle(w, 2)
  return w
}

describe('AiButler', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('悬浮圈开合对话窗', async () => {
    const w = await openButler()
    expect(w.find('.drawer').exists()).toBe(true)
    expect(w.text()).toContain('AI 管家')
  })

  it('R1 主线 chip → 递进前缀 → 主线点亮节点并出方案卡（pacing=0 加速）', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    // 递进：r2 组出现
    expect(w.text()).toContain('预算一千五')
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    // 主线：三节点点亮 + A/B 卡 + 腊肉彩蛋
    expect(w.findAll('.node.on')).toHaveLength(3)
    expect(w.text()).toContain('云上人家')
    expect(w.text()).toContain('云雾观星客栈')
    expect(w.text()).toContain('腊肉')
  })

  it('登录后一键预订：三接口按序真实调用，常驻条三项点亮', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(accBooking).toHaveBeenCalledWith(expect.objectContaining({ roomTypeId: 2, checkInDate: '2026-10-01', checkOutDate: '2026-10-03', rooms: 1, guestName: '山野小鱼' }))
    expect(foodResv).toHaveBeenCalledWith(expect.objectContaining({ restaurantId: 3, timeSlotId: 301, reservationDate: '2026-10-01', peopleCount: 2, contactName: '山野小鱼' }))
    expect(travelBooking).toHaveBeenCalledWith({ itemType: 'route', itemId: 2, useDate: '2026-10-01', quantity: 2 })
    expect(payCreate).toHaveBeenCalledWith('WD-TKT-1')
    expect(payMock).toHaveBeenCalledWith('PAY-1')
    expect(w.findAll('.mini.on')).toHaveLength(3)
    expect(w.text()).toContain('手信')
  })

  it('未登录点预订 → 提示登录，不调接口', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(w.text()).toContain('请先在右上角登录')
    expect(accBooking).not.toHaveBeenCalled()
  })

  it('任一接口失败 → 该项降级「演示数据」，其余成功', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    travelBooking.mockRejectedValueOnce(new Error('boom'))
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(w.text()).toContain('演示数据')
    expect(w.findAll('.mini.on')).toHaveLength(3) // 降级项也点亮（样式不同由 demo 标记体现）
  })

  it('自由输入未命中 → 兜底话术', async () => {
    const w = await openButler()
    await w.find('input').setValue('今天天气怎么样')
    await w.find('input').trigger('keyup', { key: 'Enter' })
    await settle(w, 3)
    expect(w.text()).toContain('快捷提问')
  })

  it('预订进行中重复触发 → 门卫拦截，接口只调一次', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    let resolveAcc!: (v: any) => void
    accBooking.mockImplementationOnce(() => new Promise((r) => { resolveAcc = r }))
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    // 等 doBook 真正进入进行中（accBooking 已调、尚未 resolve）
    for (let i = 0; i < 60 && !accBooking.mock.calls.length; i++) { await flushPromises(); await tick() }
    expect(accBooking).toHaveBeenCalledTimes(1)
    // 一键预订按钮仍可见（尚无 booked 结果），再点一次 → 应被门卫拦下
    await w.find('.book').trigger('click')
    resolveAcc({ orderNo: 'WD-ACC-1', payAmount: 632, nights: ['2026-10-01', '2026-10-02'] })
    await settle(w)
    expect(accBooking).toHaveBeenCalledTimes(1)
    expect(w.findAll('.mini.on')).toHaveLength(3)
  })

  it('主线播放被打断 → 不误置 PLANS、清 thinking/busy 孤儿', async () => {
    const w = await openButler()
    for (const label of ['带爸妈', '预算一千五', '想要安静']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('想吃长桌宴'))!.trigger('click')
    // 4 个宏任务：第 3 个前缀确认播完 + 主线恰好播到「正在检索」thinking 挂起
    for (let i = 0; i < 4; i++) await tick()
    await w.find('input').setValue('乌东有什么好吃的')
    await w.find('input').trigger('keyup', { key: 'Enter' })
    await settle(w)
    expect(w.find('.think').exists()).toBe(false) // thinking 孤儿被清
    expect(w.find('.node.running').exists()).toBe(false) // busy 孤儿被清
    expect(w.text()).toContain('酸汤鱼') // 打断后走完的是吃支线
    // stage 未被误置 PLANS：随后点「帮我一起安排」不应出现「回到正题」死胡同
    await w.findAll('.chip').find((c) => c.text().includes('帮我一起安排'))!.trigger('click')
    await settle(w)
    expect(w.text()).not.toContain('回到正题')
    expect(w.find('.pcard').exists()).toBe(false)
  })

  it('双击悬浮圈 → 直达预订拍（方案卡 + 三节点全亮 + r3 chips），再双击 no-op', async () => {
    const w = await openButler()
    await w.find('.fab').trigger('dblclick')
    await settle(w, 3)
    expect(w.findAll('.pcard')).toHaveLength(2)
    expect(w.findAll('.node.on')).toHaveLength(3)
    expect(w.text()).toContain('就按 A 方案订') // r3 chips 就位，可直接点预订
    // 已在 PLANS 态：再双击 no-op，不报错、状态不回退
    await w.find('.fab').trigger('dblclick')
    await settle(w, 3)
    expect(w.findAll('.pcard')).toHaveLength(2)
    expect(w.findAll('.node.on')).toHaveLength(3)
  })

  it('重排后绑定跟 A 走：A 卡（沉底）仍带 ⚡ 按钮，B 卡（顶上）裸展示；点 A 卡按钮走预订门卫', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('换个离梯田更近的'))!.trigger('click')
    await settle(w)
    const pcards = w.findAll('.pcard')
    expect(pcards).toHaveLength(2)
    expect(pcards[0].text()).toContain('云雾观星客栈') // B 顶上
    expect(pcards[1].text()).toContain('云上人家') // A 沉底
    expect(pcards[0].find('.book').exists()).toBe(false) // B 裸展示
    expect(pcards[1].find('.book').exists()).toBe(true) // A 无论位置都带按钮
    // 重排后 r3 chips 恢复，可继续点
    expect(w.text()).toContain('就按 A 方案订')
    // A 卡按钮是活的：未登录点击 → bookA → 门卫提示登录，不调接口
    await pcards[1].find('.book').trigger('click')
    await settle(w)
    expect(w.text()).toContain('请先在右上角登录')
    expect(accBooking).not.toHaveBeenCalled()
  })

  it('同一偏好 chip 重复点击只计一次（不重复计数提前进主线）', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    await w.findAll('.chip').find((c) => c.text().includes('预算一千五'))!.trigger('click')
    await settle(w)
    await w.findAll('.chip').find((c) => c.text().includes('预算一千五'))!.trigger('click')
    await settle(w)
    expect(w.find('.pcard').exists()).toBe(false) // 仍在前缀段，未误进主线
    expect(w.text()).toContain('想吃长桌宴') // r2 chips 仍在等剩余偏好
    for (const label of ['想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    expect(w.findAll('.pcard')).toHaveLength(2) // 3 个不同偏好集齐 → 主线出方案
  })
})
