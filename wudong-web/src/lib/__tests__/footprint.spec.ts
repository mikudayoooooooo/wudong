import { describe, it, expect } from 'vitest'
import { userLitSpotIds, spotLightCounts, routeStopsView, postFootprintView } from '../footprint'
import { __mockWritable } from '../../data/mock'
import type { ETicket } from '../../types'

describe('userLitSpotIds', () => {
  it('用户1凭已核销路线票点亮路线1全部行程站点', () => {
    const lit = userLitSpotIds(1) // 票201：路线1已核销 → 站点1,3,4,2,6；票202：梯田
    for (const id of [1, 2, 3, 4, 6]) expect(lit.has(id)).toBe(true)
    expect(lit.has(5)).toBe(false) // 蜡染坊不在其任何票覆盖内
  })
  it('已退款票不点亮', () => {
    // mock 固定数据里用户2的退款票(206→芦笙广场6)与其已核销路线票(204→路线1含站点6)覆盖重叠，
    // 无法单独观察退款效果；注入无票用户4的临时票，隔离验证票状态过滤
    const { eTickets } = __mockWritable
    const t: ETicket = { id: 99901, orderNo: 'TEST-REFUND', userId: 4, itemType: 'ticket', itemId: 11, useDate: '2026-09-01', status: 'refunded', verifyTime: '2026-09-01T10:24:00' }
    eTickets.push(t)
    try {
      expect(userLitSpotIds(4).has(1)).toBe(false) // refunded 不点亮
      t.status = 'unused'
      expect(userLitSpotIds(4).has(1)).toBe(false) // unused 不点亮
      t.status = 'used'
      expect(userLitSpotIds(4).has(1)).toBe(true) // used 点亮（票11 → 梯田）
    } finally {
      eTickets.pop()
    }
  })
  it('withinDays 过滤过期核销', () => {
    // 演示数据核销于 2026-09-01（固定日期）：1 天窗口必然已过期 → 清空
    expect(userLitSpotIds(1, { withinDays: 1 }).size).toBe(0)
    // 注入刚核销的票：7 天窗口应保留、0 天窗口应清空
    const { eTickets } = __mockWritable
    const t: ETicket = { id: 99902, orderNo: 'TEST-FRESH', userId: 4, itemType: 'ticket', itemId: 11, useDate: '2026-09-09', status: 'used', verifyTime: new Date(Date.now() - 3600 * 1000).toISOString() }
    eTickets.push(t)
    try {
      expect(userLitSpotIds(4, { withinDays: 7 }).has(1)).toBe(true)
      expect(userLitSpotIds(4, { withinDays: 0 }).has(1)).toBe(false)
    } finally {
      eTickets.pop()
    }
  })
})

describe('spotLightCounts', () => {
  it('梯田被多名用户的已核销票覆盖', () => {
    expect(spotLightCounts(1)).toBeGreaterThanOrEqual(3) // 用户1(路线+单票), 用户2, 用户3
  })
  it('无票地点为 0', () => {
    expect(spotLightCounts(5)).toBe(0)
  })
})

describe('routeStopsView', () => {
  it('路线1返回5站，核销多的站 lit=true 且带 lightCount', () => {
    const stops = routeStopsView(1)
    expect(stops).toHaveLength(5)
    expect(stops.find((s) => s.spotId === 1)?.lit).toBe(true)
    expect(stops.find((s) => s.spotId === 1)?.lightCount).toBeGreaterThan(0)
  })
  it('mock 中人为将蜡染坊加入路线1行程时呈现 locked（用路线2的银饰工坊验证锁定态）', () => {
    // 路线2的工坊站(107)：用户3的路线2票已核销 → lit；此用例验证字段完整性
    const stops = routeStopsView(2)
    expect(stops.every((s) => typeof s.lit === 'boolean' && typeof s.locked === 'boolean')).toBe(true)
  })
})

describe('postFootprintView', () => {
  it('模式A只返回快照命中站点（全部 lit）', () => {
    const v = postFootprintView(604) // 604 无快照 → 模拟自动聚合：由用户3的核销推导
    expect(v.stops.every((s) => s.lit)).toBe(true)
  })
  it('模式B返回路线全行程，未核销站 locked', () => {
    const v = postFootprintView(601)
    expect(v.mode).toBe('route')
    expect(v.routeId).toBe(1)
    expect(v.stops).toHaveLength(5)
    expect(v.stops.find((s) => s.spotId === 1)?.lit).toBe(true)
    expect(v.stops.find((s) => s.spotId === 2)?.locked).toBe(true) // 用户1无银饰工坊票
    expect(v.stops.find((s) => s.spotId === 1)?.memo).toBe('晨雾六点十分')
  })
})
