import { getAllSpots } from '../data/mock'
import { spotLightCounts } from './footprint'

const KIND: Record<string, string> = { spot: '景区', dining: '餐饮 · 食', stay: '住宿 · 住', experience: '体验' }

export function weeklyLeaderboard() {
  return getAllSpots()
    .map((s) => ({ spotId: s.id, name: s.name, icon: s.icon, kind: KIND[s.type], count: spotLightCounts(s.id) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
