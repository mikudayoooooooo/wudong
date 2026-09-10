import { http } from '../lib/http'

export interface LoginResult {
  userId?: number
  nickname?: string
  token: string
  refreshToken: string
}

export const memberApi = {
  sendSmsCode: (phone: string) =>
    http.post<{ code?: string }>('/app/member/login/smsCode', { phone }),
  register: (p: { phone: string; smsCode: string; password: string; nickname?: string }) =>
    http.post<LoginResult>('/app/member/login/register', p),
  loginByPassword: (phone: string, password: string) =>
    http.post<LoginResult>('/app/member/login/password', { phone, password }),
  loginBySms: (phone: string, smsCode: string) =>
    http.post<LoginResult>('/app/member/login/sms', { phone, smsCode }),
  refreshToken: (refreshToken: string) =>
    http.post<LoginResult>('/app/member/login/refreshToken', { refreshToken }),
  person: () => http.get<any>('/app/member/info/person'),
  favoriteToggle: (targetType: string, targetId: number) =>
    http.post<{ favorited: boolean }>('/app/member/favorite/toggle', { targetType, targetId }),
  favoriteCheck: (targetType: string, targetId: number) =>
    http.get<boolean>(`/app/member/favorite/check?targetType=${targetType}&targetId=${targetId}`),
}
