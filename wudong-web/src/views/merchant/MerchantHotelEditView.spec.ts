import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHotelEditView from './MerchantHotelEditView.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import TagInput from '@/components/TagInput.vue';
import { merchantHotelInfo, merchantHotelSave } from '@/api/merchant';
import type { MerchantHotel } from '@/api/types';

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

  it('编辑保存：提交载荷整体塑形（trim + Number 强转 + id）', async () => {
    const { wrapper } = await mountView('/merchant/hotels/7/edit');
    await wrapper.find('.field-name input').setValue('  改后的名字  ');
    await wrapper.find('.field-address input').setValue('  雷山县二组  ');
    await wrapper.find('.field-deposit input').setValue('150');
    await wrapper.find('.field-status select').setValue('0');
    await wrapper.find('.field-hasBreakfast select').setValue('0');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(merchantHotelSave).toHaveBeenCalledTimes(1);
    // 整对象断言（不是 objectContaining）：trim / 三处 Number() / 编辑态 id / 图片标签接线
    // 任意一处被删掉，这里都必须变红
    expect(vi.mocked(merchantHotelSave).mock.calls[0][0]).toEqual({
      id: 7,
      name: '改后的名字',
      address: '雷山县二组',
      longitude: 108.107,
      latitude: 26.403,
      styleTags: ['苗寨', '江景'],
      facilityTags: ['WiFi'],
      mainImage: '/a.jpg',
      images: ['/a.jpg'],
      intro: '梯田木楼',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      petPolicy: '可携带小型宠物',
      hasBreakfast: 0,
      deposit: 150,
      status: 0,
    });
  });

  it('新建保存：提交载荷不含 id', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    const payload = vi.mocked(merchantHotelSave).mock.calls[0][0];
    expect(payload.id).toBeUndefined();
    // 新增态数字字段同样必须经过 Number()（字符串会落库成错的类型）
    expect(payload.longitude).toBe(108.2);
    expect(payload.latitude).toBe(26.5);
    expect(payload.hasBreakfast).toBe(0);
    expect(payload.status).toBe(1);
  });

  it('图片与标签经子组件回写后进入提交载荷', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');

    const tagInputs = wrapper.findAllComponents(TagInput);
    await tagInputs[0].vm.$emit('update:modelValue', ['苗寨', '观星']);
    await tagInputs[1].vm.$emit('update:modelValue', ['WiFi']);
    const uploaders = wrapper.findAllComponents(ImageUploader);
    await uploaders[0].vm.$emit('update:modelValue', ['/m.png']);
    await uploaders[1].vm.$emit('update:modelValue', ['/i1.png', '/i2.png']);
    await flushPromises();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    const payload = vi.mocked(merchantHotelSave).mock.calls[0][0];
    expect(payload.styleTags).toEqual(['苗寨', '观星']);
    expect(payload.facilityTags).toEqual(['WiFi']);
    expect(payload.mainImage).toBe('/m.png');
    expect(payload.images).toEqual(['/i1.png', '/i2.png']);
  });

  it('提交进行中再次提交被忽略（只调用一次保存）', async () => {
    let resolveSave: (v: MerchantHotel) => void = () => {};
    vi.mocked(merchantHotelSave).mockReturnValue(
      new Promise<MerchantHotel>((resolve) => {
        resolveSave = resolve;
      })
    );
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');

    // 直接对 form 触发两次 submit：不经过 :disabled 的按钮，才能验到函数内的重入守卫
    const form = wrapper.find('form');
    await form.trigger('submit');
    await form.trigger('submit');

    expect(merchantHotelSave).toHaveBeenCalledTimes(1);
    resolveSave(hotelFixture);
    await flushPromises();
  });

  it('详情加载失败展示错误', async () => {
    vi.mocked(merchantHotelInfo).mockRejectedValue(new Error('无权操作该资源'));
    const { wrapper } = await mountView('/merchant/hotels/7/edit');
    expect(wrapper.text()).toContain('无权操作该资源');
  });
});
