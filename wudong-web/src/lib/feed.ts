import type { Post } from '../types'

export function sortPosts(
  posts: Post[], tab: 'recommend' | 'latest' | 'follow', followedUserIds: number[] = [],
): Post[] {
  const list = [...posts]
  if (tab === 'latest') return list.sort((a, b) => b.createTime.localeCompare(a.createTime))
  if (tab === 'follow') return list.filter((p) => followedUserIds.includes(p.userId))
  return list.sort((a, b) => b.likeCount * 2 + b.viewCount / 10 - (a.likeCount * 2 + a.viewCount / 10))
}
