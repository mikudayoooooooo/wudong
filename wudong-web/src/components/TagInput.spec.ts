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

  it('输入法组词中回车（isComposing）不添加标签，也不拦截默认行为', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('miao');
    // 不用 VTU 的 trigger：jsdom 的 KeyboardEvent.prototype.isComposing 只有 getter，
    // trigger 的 options 写不进去；这里直接构造真实事件派发。
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      isComposing: true,
      bubbles: true,
      cancelable: true,
    });
    input.element.dispatchEvent(event);

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect((input.element as HTMLInputElement).value).toBe('miao');
    // 组词中不得 preventDefault（否则会打断输入法选词）
    expect(event.defaultPrevented).toBe(false);
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
