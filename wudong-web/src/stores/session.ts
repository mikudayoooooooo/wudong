import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserBrief } from '../types'
import { memberApi } from '../api/member'
import { getToken, setTokens, clearTokens, getRefreshToken, onUnauthorized } from '../lib/http'

export const useSession = defineStore('session', () => {
  const user = ref<UserBrief | undefined>(undefined)
  const isLogged = computed(() => !!user.value)

  /** 启动时恢复会话：有 token 则拉取个人信息；失效尝试刷新 */
  async function init() {
    onUnauthorized(() => {
      user.value = undefined
      clearTokens()
    })
    if (!getToken()) return
    try {
      const p = await memberApi.person()
      user.value = { id: p.id, nickname: p.nickname, avatar: p.avatar, bio: p.bio }
    } catch {
      const rt = getRefreshToken()
      if (rt) {
        try {
          const r = await memberApi.refreshToken(rt)
          setTokens(r.token, r.refreshToken)
          const p = await memberApi.person()
          user.value = { id: p.id, nickname: p.nickname, avatar: p.avatar, bio: p.bio }
          return
        } catch {
          /* fallthrough */
        }
      }
      user.value = undefined
      clearTokens()
    }
  }

  function applyLogin(r: { token: string; refreshToken: string }) {
    setTokens(r.token, r.refreshToken)
  }

  async function loginByPassword(phone: string, password: string) {
    const r = await memberApi.loginByPassword(phone, password)
    applyLogin(r)
    const p = await memberApi.person()
    user.value = { id: p.id, nickname: p.nickname, avatar: p.avatar, bio: p.bio }
  }

  async function loginBySms(phone: string, smsCode: string) {
    const r = await memberApi.loginBySms(phone, smsCode)
    applyLogin(r)
    const p = await memberApi.person()
    user.value = { id: p.id, nickname: p.nickname, avatar: p.avatar, bio: p.bio }
  }

  function logout() {
    user.value = undefined
    clearTokens()
  }

  return { user, isLogged, init, applyLogin, loginByPassword, loginBySms, logout }
})
