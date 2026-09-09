import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterBar from './FilterBar.vue';

const styles = ['苗寨', '山景'];

describe('FilterBar rating 往返', () => {
  it('modelValue.rating=4（URL 解析所得数字）回填为选项 "4.0"，select 不空白', () => {
    const w = mount(FilterBar, { props: { modelValue: { rating: 4 }, styles } });
    expect((w.find('.rate').element as HTMLSelectElement).value).toBe('4.0');
    w.unmount();
  });
  it('选择 "4.0+ 分" → update:modelValue{rating:4} → 父级回写数字 4 后仍保持选中', async () => {
    const w = mount(FilterBar, { props: { modelValue: {}, styles } });
    const sel = w.find('.rate');
    await sel.setValue('4.0');
    const emitted = w.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0][0] as Record<string, unknown>).toMatchObject({ rating: 4 });
    // 父级 v-model 把数字 4 回传
    await w.setProps({ modelValue: { rating: 4 } });
    expect((sel.element as HTMLSelectElement).value).toBe('4.0');
    w.unmount();
  });
});
