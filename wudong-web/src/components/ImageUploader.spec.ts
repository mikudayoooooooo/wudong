import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ImageUploader from './ImageUploader.vue';
import { uploadImage } from '@/api/upload';

vi.mock('@/api/upload', () => ({ uploadImage: vi.fn() }));

afterEach(() => {
  vi.mocked(uploadImage).mockReset();
});

/** 构造一个选择文件的 change 事件 */
const pickFile = (wrapper: any, name = 'a.png') => {
  const input = wrapper.find('input[type="file"]');
  const file = new File(['x'], name, { type: 'image/png' });
  Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
  return input.trigger('change');
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

  it('上传失败时展示错误且不写入 modelValue', async () => {
    vi.mocked(uploadImage).mockRejectedValue(new Error('上传失败'));
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });
    await pickFile(wrapper);
    await flushPromises();
    expect(wrapper.text()).toContain('上传失败');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
