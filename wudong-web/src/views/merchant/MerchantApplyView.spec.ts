import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantApplyView from './MerchantApplyView.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import { merchantApplication, merchantApply, merchantMy } from '@/api/merchant';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/api/merchant', () => ({
  merchantApplication: vi.fn(),
  merchantApply: vi.fn(),
  merchantMy: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantMy).mockReset().mockResolvedValue(null);
  vi.mocked(merchantApplication).mockReset().mockResolvedValue(null);
  vi.mocked(merchantApply).mockReset().mockResolvedValue(true);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/apply', name: 'merchant-apply', component: MerchantApplyView },
      { path: '/merchant', name: 'merchant-home', component: { template: '<div>home</div>' } },
    ],
  });
  await router.push('/merchant/apply');
  await router.isReady();
  const wrapper = mount(MerchantApplyView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

/** 填写文本类必填项（模块保持默认 accommodation） */
async function fillForm(wrapper: any) {
  await wrapper.find('.field-shopName input').setValue('苗银世家');
  await wrapper.find('.field-contactName input').setValue('张三');
  await wrapper.find('.field-contactPhone input').setValue('13300133001');
  await wrapper.find('.field-idCard input').setValue('522301199001010011');
}

/** 三张证件图：直接触发 ImageUploader 的 v-model 回写（不走真实上传） */
async function fillImages(wrapper: any) {
  for (const uploader of wrapper.findAllComponents(ImageUploader)) {
    await uploader.vm.$emit('update:modelValue', ['http://img/x.png']);
  }
  await flushPromises();
}

describe('MerchantApplyView', () => {
  it('无申请：展示申请表单且默认住宿模块', async () => {
    const { wrapper } = await mountView();
    expect(wrapper.find('.apply-form').exists()).toBe(true);
    expect(
      (wrapper.find('.field-module select').element as HTMLSelectElement).value
    ).toBe('accommodation');
  });

  it('必填缺失时不提交并提示', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.apply-form').trigger('submit');
    await flushPromises();
    expect(merchantApply).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写完整的入驻信息');
  });

  it('提交成功后展示待审核状态', async () => {
    // 提交成功后页面会重新 load()，此时应查到一条待审核申请
    vi.mocked(merchantApply).mockImplementation(async () => {
      vi.mocked(merchantApplication).mockResolvedValue({
        id: 9,
        shopName: '苗银世家',
        module: 'accommodation',
        contactName: '张三',
        contactPhone: '13300133001',
        idCard: '522301199001010011',
        status: 1,
      });
      return true;
    });

    const { wrapper } = await mountView();
    // 图片经 ImageUploader 的 v-model 写入：直接触发子组件 emit
    await fillImages(wrapper);
    await fillForm(wrapper);
    await flushPromises();
    await wrapper.find('.apply-form').trigger('submit');
    await flushPromises();

    expect(merchantApply).toHaveBeenCalledWith(
      expect.objectContaining({
        shopName: '苗银世家',
        module: 'accommodation',
        idCardFront: 'http://img/x.png',
        idCardBack: 'http://img/x.png',
        businessLicense: 'http://img/x.png',
      })
    );
    expect(wrapper.text()).toContain('待审核');
  });

  it('已入驻：提示已入驻且不展示表单', async () => {
    vi.mocked(merchantMy).mockResolvedValue({
      id: 1,
      userId: 1,
      username: 'm1',
      shopName: '乌东苗寨木楼',
      module: 'accommodation',
      contactName: '杨阿妹',
      contactPhone: '13300133001',
      status: 1,
    });
    const { wrapper } = await mountView();
    expect(wrapper.find('.apply-form').exists()).toBe(false);
    expect(wrapper.text()).toContain('已入驻');
  });

  it('待审核申请：展示审核中并隐藏表单', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 1,
    });
    const { wrapper } = await mountView();
    expect(wrapper.find('.apply-form').exists()).toBe(false);
    expect(wrapper.text()).toContain('待审核');
  });

  it('驳回后可重新提交并展示驳回原因', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 3,
      auditResult: '营业执照不清晰',
    });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('营业执照不清晰');
    expect(wrapper.find('.apply-form').exists()).toBe(true);
    expect(
      (wrapper.find('.field-shopName input').element as HTMLInputElement).value
    ).toBe('苗银世家'); // 用上次资料预填
  });

  it('刷新失败但 store 已有店铺：错误条与已入驻卡不得同屏', async () => {
    // 两条独立 v-if（而不是互斥链）时，这里会同时渲染「加载失败」和「已入驻」两条互相矛盾的信息
    useAuthStore().merchant = {
      id: 1,
      userId: 1,
      username: 'm1',
      shopName: '乌东苗寨木楼',
      module: 'accommodation',
      contactName: '杨阿妹',
      contactPhone: '13300133001',
      status: 1,
    };
    vi.mocked(merchantMy).mockRejectedValue(new Error('网络异常'));

    const { wrapper } = await mountView();

    expect(wrapper.text()).toContain('网络异常');
    expect(wrapper.text()).not.toContain('已通过审核');
  });

  it('提交失败展示后端 message', async () => {
    vi.mocked(merchantApply).mockRejectedValue(new Error('已存在待审核的入驻申请'));
    const { wrapper } = await mountView();
    await fillImages(wrapper);
    await fillForm(wrapper);
    await wrapper.find('.apply-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('已存在待审核的入驻申请');
  });
});
