import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHotelEditView from './MerchantHotelEditView.vue';
import { merchantHotelInfo, merchantHotelSave } from '@/api/merchant';

vi.mock('@/api/merchant', () => ({
  merchantHotelInfo: vi.fn(),
  merchantHotelSave: vi.fn(),
}));

const hotelFixture = {
  id: 7,
  name: '乌东苗寨木楼',
  address: '雷山县 · 乌东村一组',
  longitude: 108.107,
  latitude: 26.403,
  styleTags: ['苗寨', '江景'],
  facilityTags: ['WiFi'],
  mainImage: '/a.jpg',
  images: ['/a.jpg'],
  intro: '梯田木楼',
  rating: 4.8,
  reviewCount: 126,
  minPrice: 380,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '可携带小型宠物',
  hasBreakfast: 1,
  deposit: 100,
  status: 1,
  merchantId: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantHotelInfo).mockReset().mockResolvedValue(hotelFixture);
  vi.mocked(merchantHotelSave)
    .mockReset()
    .mockResolvedValue({ ...hotelFixture, name: '改后的名字' });
});

async function mountView(path = '/merchant/hotels/new') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/hotels', name: 'merchant-hotels', component: { template: '<div>list</div>' } },
      { path: '/merchant/hotels/new', name: 'merchant-hotel-new', component: MerchantHotelEditView },
      { path: '/merchant/hotels/:id/edit', name: 'merchant-hotel-edit', component: MerchantHotelEditView },
    ],
  });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(MerchantHotelEditView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantHotelEditView', () => {
  it('新建态：标题为新增且不请求详情', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    expect(wrapper.text()).toContain('新增民宿');
    expect(merchantHotelInfo).not.toHaveBeenCalled();
  });

  it('编辑态：加载详情并预填表单', async () => {
    const { wrapper } = await mountView('/merchant/hotels/7/edit');
    expect(merchantHotelInfo).toHaveBeenCalledWith(7);
    expect(wrapper.text()).toContain('编辑民宿');
    expect(
      (wrapper.find('.field-name input').element as HTMLInputElement).value
    ).toBe('乌东苗寨木楼');
    expect(
      (wrapper.find('.field-deposit input').element as HTMLInputElement).value
    ).toBe('100');
  });

  it('必填缺失时提示且不提交', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(merchantHotelSave).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写民宿名称与地址');
  });

  it('经纬度为空或 0 时提示且不提交', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('');
    await wrapper.find('.field-latitude input').setValue('');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(merchantHotelSave).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写经纬度');

    // 0 同样视为未填写（未动过的默认值不能让民宿落在 (0, 0)）
    await wrapper.find('.field-longitude input').setValue('0');
    await wrapper.find('.field-latitude input').setValue('0');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(merchantHotelSave).not.toHaveBeenCalled();
  });

  it('新建保存：提交不含 id 并返回列表', async () => {
    const { wrapper, router } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(merchantHotelSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '新院子',
        address: '雷山县六组',
        longitude: 108.2,
        latitude: 26.5,
      })
    );
    expect(vi.mocked(merchantHotelSave).mock.calls[0][0].id).toBeUndefined();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels');
  });

  it('编辑保存：提交带 id', async () => {
    const { wrapper, router } = await mountView('/merchant/hotels/7/edit');
    await wrapper.find('.field-name input').setValue('改后的名字');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(vi.mocked(merchantHotelSave).mock.calls[0][0].id).toBe(7);
    expect(router.currentRoute.value.path).toBe('/merchant/hotels');
  });

  it('保存失败展示后端 message', async () => {
    vi.mocked(merchantHotelSave).mockRejectedValue(
      new Error('您的入驻模块非住宿，无法新增民宿')
    );
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    // 经纬度必须给非 0 值：否则 submit() 的「不能为空或 0」守卫会先返回，
    // 根本走不到 merchantHotelSave，这条断言永远拿不到后端的 message。
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('您的入驻模块非住宿，无法新增民宿');
  });

  it('详情加载失败展示错误', async () => {
    vi.mocked(merchantHotelInfo).mockRejectedValue(new Error('无权操作该资源'));
    const { wrapper } = await mountView('/merchant/hotels/7/edit');
    expect(wrapper.text()).toContain('无权操作该资源');
  });
});
