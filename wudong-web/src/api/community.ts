import { http } from '../lib/http'
import type { StopView } from './travel'

export interface FootprintView {
  mode: 'auto' | 'route'
  routeId: number | null
  stops: StopView[]
}

export const communityApi = {
  /** 信息流：tab=recommend|latest|follow；linkedRouteId 过滤某路线游记 */
  feed: (tab = 'recommend', page = 1, size = 20, linkedRouteId?: number) => {
    const qs = new URLSearchParams({ tab, page: String(page), size: String(size) })
    if (linkedRouteId) qs.set('linkedRouteId', String(linkedRouteId))
    return http.get<{ list: any[]; total: number }>(`/app/community/post/feed?${qs}`)
  },
  postDetail: (id: number) => http.get<any>(`/app/community/post/detail?id=${id}`),
  postAdd: (p: { title: string; content: string; images?: number[]; topicIds?: number[] }) =>
    http.post<{ id: number; status: string }>('/app/community/post/add', p),
  attachRoute: (p: { postId: number; routeId: number; stops: { spotId: number; dayNo?: number; memo?: string; photo?: string }[] }) =>
    http.post<any>('/app/community/post/attachRoute', p),
  postDelete: (id: number) => http.post<boolean>('/app/community/post/delete', { id }),
  commentList: (postId: number) => http.get<any[]>(`/app/community/comment/list?postId=${postId}`),
  commentAdd: (p: { postId: number; content: string; parentId?: number }) =>
    http.post<{ id: number }>('/app/community/comment/add', p),
  likeToggle: (targetType: 'post' | 'comment', targetId: number) =>
    http.post<{ liked: boolean; count: number }>('/app/community/like/toggle', { targetType, targetId }),
  topicList: () => http.get<any[]>('/app/community/topic/list'),
  topicDetail: (id: number) => http.get<any>(`/app/community/topic/detail?id=${id}`),
  topicFollow: (topicId: number) => http.post<{ followed: boolean }>('/app/community/topic/follow', { topicId }),
  followToggle: (followingId: number) => http.post<{ followed: boolean }>('/app/community/follow/toggle', { followingId }),
  userProfile: (id: number) => http.get<any>(`/app/community/user/profile?id=${id}`),
  search: (keyword: string) =>
    http.get<{ posts: any[]; topics: any[]; users: any[] }>(
      `/app/community/search/list?keyword=${encodeURIComponent(keyword)}`
    ),
  reportAdd: (p: { targetType: string; targetId: number; reason: string }) =>
    http.post<boolean>('/app/community/report/add', p),
  messagePage: (page = 1, size = 10, type?: string) => {
    const qs = new URLSearchParams({ page: String(page), size: String(size) })
    if (type) qs.set('type', type)
    return http.get<{ list: any[]; total: number }>(`/app/community/message/page?${qs}`)
  },
}
