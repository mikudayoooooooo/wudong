import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ImageUploader from './ImageUploader.vue';
import { uploadImage } from '@/api/upload';

vi.mock('@/api/upload', () => ({ uploadImage: vi.fn() }));

afterEach(() => {
  vi.mocked(uploadImage).mockReset();
});

/** 把文件塞进 input.files（jsdom 里 files 只读，须 defineProperty） */
const attachFiles = (wrapper: any, names: string[]) => {
  const input = wrapper.find('input[type="file"]');
  const files = names.map((n) => new File(['x'], n, { type: 'image/png' }));
  Object.defineProperty(input.element, 'files', { value: files, configurable: true });
  return input;
};

/** 构造一个选择文件的 change 事件 */
const pickFile = (wrapper: any, name = 'a.png') =>
  attachFiles(wrapper, [name]).trigger('change');

/** 同上，但直接派发事件：绕开 VTU 对 disabled 元素的 trigger 拦截（才能验到函数内守卫） */
const pickFileRaw = (wrapper: any, name = 'a.png') => {
  const input = attachFiles(wrapper, [name]);
  input.element.dispatchEvent(new Event('change'));
};

describe('ImageUploader', () => {
  it('选择文件后上传并追加到 modelValue', async () => {
    vi.mocked(uploadImage).mockResolvedValue('http://img/a.png');
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });
    await pickFile(wrapper);
    await flushPromises();
    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['http://img/a.png'],
    ]);
  });

  it('已达 max 时不再展示上传入口', async () => {
    const wrapper = mount(ImageUploader, {
      props: { modelValue: ['a.jpg'], max: 1 },
    });
    expect(wrapper.find('input[type="file"]').exists()).toBe(false);
  });

  it('删除图片后 emit 剩余列表', async () => {
    const wrapper = mount(ImageUploader, {
      props: { modelValue: ['a.jpg', 'b.jpg'] },
    });
    await wrapper.findAll('.image-remove')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a.jpg']]);
  });

  it('上传失败时展示逐字错误且不写入 modelValue', async () => {
    // 用与组件兜底文案不同的消息，并逐字断言，避免「toContain('上传失败')」这类恒真断言
    vi.mocked(uploadImage).mockRejectedValue(new Error('图片服务不可用'));
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });
    await pickFile(wrapper);
    await flushPromises();
    expect(wrapper.find('.m-state.m-error').text()).toBe('图片服务不可用');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('上传进行中再次选择文件被忽略（不并发上传、不突破 max）', async () => {
    let resolveFirst: (v: string) => void = () => {};
    vi.mocked(uploadImage).mockReturnValue(
      new Promise<string>((resolve) => {
        resolveFirst = resolve;
      })
    );
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });

    const first = pickFile(wrapper);
    await flushPromises();
    expect(uploadImage).toHaveBeenCalledTimes(1);

    // 直接派发：此刻 :disabled 已生效，VTU 的 trigger 会被整条跳过，验不到函数内的守卫
    pickFileRaw(wrapper, 'b.png');
    await flushPromises();
    expect(uploadImage).toHaveBeenCalledTimes(1);

    resolveFirst('http://img/a.png');
    await first;
    await flushPromises();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['http://img/a.png']]);
  });

  it('部分失败时仍交出已上传成功的 URL', async () => {
    vi.mocked(uploadImage)
      .mockResolvedValueOnce('http://img/a.png')
      .mockRejectedValueOnce(new Error('第二张失败'));
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });

    await attachFiles(wrapper, ['a.png', 'b.png']).trigger('change');
    await flushPromises();

    expect(uploadImage).toHaveBeenCalledTimes(2);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['http://img/a.png']]);
    expect(wrapper.find('.m-state.m-error').text()).toBe('第二张失败');
  });
});
