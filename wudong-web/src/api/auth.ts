// C 端会员认证：注册 / 密码登录 / 验证码 / 当前会员信息。
// 本地与测试环境后端不发短信，smsCode 接口直接把验证码放在返回值里；
// mock 模式回固定验证码 '123456'。页面需兼容“有 code / 无 code”两种形态。
import { USE_MOCK } from '../env';
import { post, request } from './http';
import type { LoginResult, MemberInfo } from './types';
import { mockLogin, mockMemberInfo, mockSendSmsCode } from '../mocks/merchant';

/** 发送短信验证码（本地/测试环境后端直接返回验证码） */
export const sendSmsCode = async (phone: string): Promise<{ code?: string }> => {
  if (USE_MOCK) return mockSendSmsCode(phone);
  return post<{ code?: string }>('/app/member/login/smsCode', { phone });
};

/** 注册（手机号 + 验证码 + 密码），成功即返回 token */
export const register = async (params: {
  phone: string;
  smsCode: string;
  password: string;
  nickname?: string;
}): Promise<LoginResult> => {
  if (USE_MOCK) return mockLogin(params.phone);
  return post<LoginResult>('/app/member/login/register', { ...params });
};

/** 密码登录 */
export const loginByPassword = async (
  phone: string,
  password: string
): Promise<LoginResult> => {
  if (USE_MOCK) return mockLogin(phone);
  return post<LoginResult>('/app/member/login/password', { phone, password });
};

/** 当前登录会员信息 */
export const memberInfo = async (): Promise<MemberInfo> => {
  if (USE_MOCK) return mockMemberInfo;
  return request<MemberInfo>('/app/member/info/person');
};
