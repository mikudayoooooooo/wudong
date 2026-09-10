import { describe, it, expect } from 'vitest'
import {
  matchInput, SCRIPT_STAGE, CHIPS, MAIN_BEATS, BOOK_BEATS, PLAN_A, PLAN_B,
  PLAN_A_TOTAL, PLAN_A_LEFT, DEMO, EXTRACT,
} from '../script'

const types = (beats: any[]) => beats.flatMap((b) => b.actions.map((a: any) => a.type))

describe('matchInput 关键词路由', () => {
  it('开场需求句/爸妈/国庆 → main', () => {
    expect(matchInput('十一想带爸妈去乌东住两晚', SCRIPT_STAGE.IDLE)).toBe('main')
  })
  it('好吃/长桌宴 → foodSide；住/安静 → staySide', () => {
    expect(matchInput('乌东有什么好吃的', SCRIPT_STAGE.IDLE)).toBe('foodSide')
    expect(matchInput('住哪里比较安静', SCRIPT_STAGE.IDLE)).toBe('staySide')
  })
  it('plans 后：订/就按 → bookA；换/梯田近 → reorder', () => {
    expect(matchInput('就按 A 方案订', SCRIPT_STAGE.PLANS)).toBe('bookA')
    expect(matchInput('换个离梯田更近的', SCRIPT_STAGE.PLANS)).toBe('reorder')
  })
  it('booked 后再问吃的 → foodSide（跨类推荐阶段）', () => {
    expect(matchInput('再看看别的', SCRIPT_STAGE.BOOKED)).toBe('more')
    expect(matchInput('谢谢管家', SCRIPT_STAGE.BOOKED)).toBe('thanks')
  })
  it('任意未命中 → unknown', () => {
    expect(matchInput('今天天气怎么样', SCRIPT_STAGE.IDLE)).toBe('unknown')
  })
})

describe('剧本数据完整性', () => {
  it('主线按序点亮三个节点，plans 出现在最后一个节点之后', () => {
    const t = types(MAIN_BEATS)
    const n0 = t.indexOf('node'), n1 = t.indexOf('node', n0 + 1), n2 = t.indexOf('node', n1 + 1)
    expect(n1).toBeGreaterThan(n0)
    expect(n2).toBeGreaterThan(n1)
    expect(t.indexOf('node')).toBeGreaterThanOrEqual(0)
    expect(t.indexOf('plans')).toBeGreaterThan(t.lastIndexOf('node'))
    expect(t).toContain('extract')
  })
  it('预订拍含 book 动作，book 之后是 crossSell（第7拍）', () => {
    const t = types(BOOK_BEATS)
    expect(t.indexOf('crossSell')).toBeGreaterThan(t.indexOf('book'))
  })
  it('A 方案明细合计 = 1398，预算剩 102', () => {
    const sum = PLAN_A.items.reduce((s: number, i: any) => s + i.amount, 0)
    expect(sum).toBe(PLAN_A_TOTAL)
    expect(PLAN_A_TOTAL).toBe(632 + 168 + 598)
    expect(PLAN_A_LEFT).toBe(1500 - PLAN_A_TOTAL)
  })
  it('住宿预订参数指向 seed 固定 id：房型2/餐厅3/时段301/路线2', () => {
    expect(DEMO).toEqual({ checkIn: '2026-10-01', checkOut: '2026-10-03', useDate: '2026-10-01', roomTypeId: 2, restaurantId: 3, timeSlotId: 301, routeItemId: 2 })
  })
  it('抽取卡 6 项；A/B 方案齐备；chips 四组递进齐备', () => {
    expect(EXTRACT).toHaveLength(6)
    expect(PLAN_A.name).toBe('云上人家')
    expect(PLAN_B.name).toBe('云雾观星客栈')
    for (const k of ['r1', 'r2', 'r3', 'r4'] as const) expect(CHIPS[k].length).toBeGreaterThan(0)
  })
})
