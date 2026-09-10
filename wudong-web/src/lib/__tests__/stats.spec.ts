import { describe, it, expect } from 'vitest'
import { weeklyLeaderboard } from '../stats'

describe('weeklyLeaderboard', () => {
  it('返回前5并按点亮次数倒序', () => {
    const board = weeklyLeaderboard()
    expect(board).toHaveLength(5)
    for (let i = 1; i < board.length; i++) expect(board[i - 1].count).toBeGreaterThanOrEqual(board[i].count)
  })
  it('包含中文类别', () => {
    expect(weeklyLeaderboard().some((b) => b.kind === '餐饮 · 食')).toBe(true)
  })
})
