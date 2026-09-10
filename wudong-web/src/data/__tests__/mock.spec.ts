import { describe, it, expect } from 'vitest'
import { getRoutes, getItinerary, getAllSpots, getPosts, getPostFootprints, getRecommendSlots, getETickets } from '../mock'

describe('mock 数据完整性', () => {
  it('每个行程站点的 spotId 都指向存在的地点', () => {
    const spotIds = new Set(getAllSpots().map((s) => s.id))
    for (const r of getRoutes())
      for (const stop of getItinerary(r.id)) expect(spotIds.has(stop.spotId), `路线${r.id}站点${stop.spotId}`).toBe(true)
  })
  it('行程站点按 dayNo + sort 排列', () => {
    const stops = getItinerary(1)
    const keys = stops.map((s) => s.dayNo * 100 + s.sort)
    expect([...keys].sort((a, b) => a - b)).toEqual(keys)
  })
  it('每篇带关联路线的游记至少有一条足迹快照', () => {
    for (const p of getPosts())
      if (p.linkedRouteId) expect(getPostFootprints(p.id).length).toBeGreaterThan(0)
  })
  it('推荐位属于同一轮换组且间隔为 5 秒', () => {
    const slots = getRecommendSlots()
    expect(slots.length).toBeGreaterThanOrEqual(3)
    expect(new Set(slots.map((s) => s.rotationGroup)).size).toBe(1)
    expect(new Set(slots.map((s) => s.intervalSeconds))).toEqual(new Set([5]))
  })
  it('演示用户1有已核销的路线电子票', () => {
    expect(getETickets(1).some((t) => t.itemType === 'route' && t.status === 'used')).toBe(true)
  })
})
