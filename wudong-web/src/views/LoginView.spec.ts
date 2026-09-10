import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import LoginView from './LoginView.vue';
import { loginByPassword, register, sendSmsCode, memberInfo } from '@/api/auth';
import { merchantMy } from '@/api/merchant';

vi.mock('@/api/auth', () => ({
  loginByPassword: vi.fn(),
  register: vi.fn(),
  sendSmsCode: vi.fn(),
  memberInfo: vi.fn(),
}));
vi.mock('@/api/merchant', () => ({ merchantMy: vi.fn() }));

const merchantFixture = {
  id: 1,
  userId: 1,
  username: 'm1',
  shopName: '乌东苗寨木楼',
  module: 'accommodation',
  contactName: '杨阿妹',
  contactPhone: '13300133001',
  status: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(loginByPassword).mockReset();
  vi.mocked(register).mockReset();
  vi.mocked(sendSmsCode).mockReset();
  vi.mocked(memberInfo).mockReset().mockResolvedValue({
    id: 1,
    phone: '13300133001',
    role: 2,
  });
  vi.mocked(merchantMy).mockReset().mockResolvedValue(merchantFixture);
});

async function mountView(redirect?: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'login', component: LoginView },
      { path: '/merchant', name: 'merchant', component: { template: '<div>merchant</div>' } },
      { path: '/', name: 'home', component: { template: '<div>home</div>' } },
    ],
  });
  await router.push({ path: '/login', query: redirect ? { redirect } : {} });
  await router.isReady();
  const wrapper = mount(LoginView, { global: { plugins: [router] } });
  return { wrapper, router };
}

describe('LoginView', () => {
  it('密码登录成功后跳转到 redirect 指定的页面', async () => {
    vi.mocked(loginByPassword).mockResolvedValue({ token: 'jwt-1' });
    const { wrapper, router } = await mountView('/merchant/hotels');

    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(loginByPassword).toHaveBeenCalledWith('13300133001', 'abc123456');
    expect(router.currentRoute.value.path).toBe('/merchant/hotels');
  });

  it('未带 redirect 时登录后进入商家区', async () => {
    vi.mocked(loginByPassword).mockResolvedValue({ token: 'jwt-1' });
    const { wrapper, router } = await mountView();
    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant');
  });

  it('redirect 指向站外地址时回落到 /merchant（不被带偏）', async () => {
    vi.mocked(loginByPassword).mockResolvedValue({ token: 'jwt-1' });
    const { wrapper, router } = await mountView('//evil.com');
    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant');
  });

  it('登录失败展示后端 message 且不跳转', async () => {
    vi.mocked(loginByPassword).mockRejectedValue(new Error('手机号或密码错误'));
    const { wrapper, router } = await mountView('/merchant');
    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('bad');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('手机号或密码错误');
    expect(router.currentRoute.value.path).toBe('/login');
  });

  it('切换到注册态显示验证码字段', async () => {
    const { wrapper } = await mountView();
    expect(wrapper.find('.sms-code-input').exists()).toBe(false);
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    expect(wrapper.find('.sms-code-input').exists()).toBe(true);
  });

  it('发送验证码后提示并回填（本地环境后端直接回验证码）', async () => {
    vi.mocked(sendSmsCode).mockResolvedValue({ code: '123456' });
    const { wrapper } = await mountView();
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    await wrapper.find('input[type="tel"]').setValue('13300133001');

    await wrapper.find('.send-code').trigger('click');
    await flushPromises();

    expect(sendSmsCode).toHaveBeenCalledWith('13300133001');
    expect(wrapper.text()).toContain('123456');
    expect(
      (wrapper.find('.sms-code-input').element as HTMLInputElement).value
    ).toBe('123456');
  });

  it('注册态密码不合规：本地拦截，不发请求', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'jwt-reg' });
    const { wrapper, router } = await mountView('/merchant');
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    await wrapper.find('input[type="tel"]').setValue('13300133002');
    await wrapper.find('.sms-code-input').setValue('123456');
    await wrapper.find('input[type="password"]').setValue('12345678'); // 纯数字，不合规
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    // 关键：断言「没发请求」，否则该文案可能只是被 register 的 rejection message 满足
    expect(register).not.toHaveBeenCalled();
    expect(wrapper.find('.m-error').text()).toBe('密码须为8-20位，且同时包含字母和数字');
    expect(router.currentRoute.value.path).toBe('/login');
  });

  it('注册成功后进入商家区', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'jwt-reg' });
    const { wrapper, router } = await mountView('/merchant');
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    await wrapper.find('input[type="tel"]').setValue('13300133002');
    await wrapper.find('.sms-code-input').setValue('123456');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(register).toHaveBeenCalledWith({
      phone: '13300133002',
      smsCode: '123456',
      password: 'abc123456',
    });
    expect(router.currentRoute.value.path).toBe('/merchant');
  });
});
