// 注意：本文件不用 vi，故不 import（tsconfig 的 noUnusedLocals 会让未用的 import 报 TS6133）
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TagInput from './TagInput.vue';

const mountInput = (modelValue: string[] = [], suggestions: string[] = []) =>
  mount(TagInput, { props: { modelValue, suggestions } });

describe('TagInput', () => {
  it('回车添加标签并清空输入框', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('苗寨');
    await input.trigger('keydown.enter');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['苗寨']]);
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('逗号也触发添加', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('江景');
    await input.trigger('keydown', { key: ',' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['江景']]);
  });

  it('重复标签不重复添加', async () => {
    const wrapper = mountInput(['苗寨']);
    const input = wrapper.find('input');
    await input.setValue('苗寨');
    await input.trigger('keydown.enter');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('空白输入被忽略', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('   ');
    await input.trigger('keydown.enter');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('点击 × 删除标签', async () => {
    const wrapper = mountInput(['苗寨', '江景']);
    const tags = wrapper.findAll('.tag-item');
    expect(tags.length).toBe(2);
    await tags[0].find('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['江景']]);
  });

  it('点击推荐标签直接添加', async () => {
    const wrapper = mountInput([], ['WiFi', '空调']);
    const chip = wrapper.findAll('.tag-suggestion')[0];
    expect(chip.text()).toBe('WiFi');
    await chip.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['WiFi']]);
  });
});
