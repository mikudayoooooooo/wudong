import { describe, it, expect } from 'vitest'
import { sortPosts } from '../feed'
import { getPosts } from '../../data/mock'

describe('sortPosts', () => {
  const posts = getPosts()
  it('latest 按发布时间倒序', () => {
    const sorted = sortPosts(posts, 'latest')
    expect(sorted[0].id).toBe(606)
  })
  it('recommend 按 热度值(like*2+view/10) 倒序', () => {
    expect(sortPosts(posts, 'recommend')[0].id).toBe(601) // 328*2+520 = 1176 最高
  })
  it('follow 只保留关注用户的帖子', () => {
    const sorted = sortPosts(posts, 'follow', [2])
    expect(sorted.every((p) => p.userId === 2)).toBe(true)
    expect(sorted.length).toBeGreaterThan(0)
  })
})
