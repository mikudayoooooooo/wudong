<script setup lang="ts">
// 标签数组输入：回车/逗号添加，点 × 删除，可点推荐标签直接添加。去重且忽略空白。
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    placeholder?: string;
    suggestions?: string[];
  }>(),
  { placeholder: '输入后回车添加', suggestions: () => [] }
);

const emit = defineEmits<{ 'update:modelValue': [string[]] }>();

const draft = ref('');

function add(tag: string): void {
  const value = tag.trim();
  if (!value || props.modelValue.includes(value)) return;
  emit('update:modelValue', [...props.modelValue, value]);
}

function onEnter(): void {
  add(draft.value);
  draft.value = '';
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === ',' || event.key === '，') {
    event.preventDefault();
    onEnter();
  }
}

function remove(index: number): void {
  const next = props.modelValue.slice();
  next.splice(index, 1);
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="tag-input">
    <div class="tag-list">
      <span v-for="(tag, index) in modelValue" :key="tag" class="tag-item">
        {{ tag }}
        <button type="button" @click="remove(index)">×</button>
      </span>
    </div>

    <input
      v-model="draft"
      type="text"
      :placeholder="placeholder"
      @keydown.enter.prevent="onEnter"
      @keydown="onKeydown"
    />

    <div v-if="suggestions.length" class="tag-suggestions">
      <button
        v-for="item in suggestions"
        :key="item"
        type="button"
        class="tag-suggestion"
        :disabled="modelValue.includes(item)"
        @click="add(item)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-input input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--green-100);
  color: var(--green-700);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 13px;
}
.tag-item button {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}
.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.tag-suggestion {
  border: 1px dashed var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  color: var(--muted);
}
.tag-suggestion:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
