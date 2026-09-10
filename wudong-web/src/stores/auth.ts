// 登录态：token 持久化在 localStorage，会员与店铺信息每次登录/进入商家区时加载。
// token 同步到 api/http 层（setAuthToken），所有后续请求自动携带。
import { defineStore } from 'pinia';
import { memberInfo, loginByPassword, register } from '../api/auth';
import { merchantMy } from '../api/merchant';
import { setAuthToken } from '../api/http';
import type { MemberInfo, MerchantInfo } from '../api/types';

const TOKEN_KEY = 'wudong_token';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    /** 裸 JWT；'' 表示未登录 */
    token: (localStorage.getItem(TOKEN_KEY) ?? '') as string,
    member: null as MemberInfo | null,
    /** 已入驻店铺；未入驻为 null */
    merchant: null as MerchantInfo | null,
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.token,
    /** 仅在店铺存在且 status=1 时视为商家（P2 与后端一致） */
    isMerchant: (state): boolean =>
      !!state.merchant && Number(state.merchant.status) === 1,
  },
  actions: {
    /** 写入/清除 token（同时同步到 http 层与本地存储） */
    setToken(token: string): void {
      this.token = token;
      setAuthToken(token || null);
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    },

    /** 加载会员与店铺信息；任一失败向上抛出由调用方决定跳转 */
    async loadProfile(): Promise<void> {
      if (!this.token) return;
      this.member = await memberInfo();
      this.merchant = await merchantMy();
    },

    /** 密码登录 → 保存 token → 加载身份 */
    async login(phone: string, password: string): Promise<void> {
      const result = await loginByPassword(phone, password);
      this.setToken(result.token);
      await this.loadProfile();
    },

    /** 注册成功即登录 */
    async registerAndLogin(params: {
      phone: string;
      smsCode: string;
      password: string;
      nickname?: string;
    }): Promise<void> {
      const result = await register(params);
      this.setToken(result.token);
      await this.loadProfile();
    },

    /** 退出：清空本地登录态（不调用后端接口） */
    logout(): void {
      this.setToken('');
      this.member = null;
      this.merchant = null;
    },
  },
});
