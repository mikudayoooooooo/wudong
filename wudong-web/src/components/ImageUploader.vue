<script setup lang="ts">
// 图片上传：点选文件 → 上传成功即追加 URL；最多 max 张（默认 6）。
import { computed, ref } from 'vue';
import { uploadImage } from '@/api/upload';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    max?: number;
    label?: string;
  }>(),
  { max: 6, label: '上传图片' }
);

const emit = defineEmits<{ 'update:modelValue': [string[]] }>();

const uploading = ref(false);
const error = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const canUpload = computed(() => props.modelValue.length < props.max);

async function onChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;

  error.value = '';
  uploading.value = true;
  try {
    const urls: string[] = [];
    for (const file of files.slice(0, props.max - props.modelValue.length)) {
      urls.push(await uploadImage(file));
    }
    emit('update:modelValue', [...props.modelValue, ...urls]);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '图片上传失败';
  } finally {
    uploading.value = false;
    input.value = ''; // 允许重复选择同一文件
  }
}

function remove(index: number): void {
  const next = props.modelValue.slice();
  next.splice(index, 1);
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="image-uploader">
    <div class="image-list">
      <div v-for="(url, index) in modelValue" :key="`${url}-${index}`" class="image-item">
        <img :src="url" alt="" />
        <button type="button" class="image-remove" @click="remove(index)">×</button>
      </div>
    </div>

    <label v-if="canUpload" class="image-pick">
      <input ref="inputRef" type="file" accept="image/*" multiple @change="onChange" />
      <span>{{ uploading ? '上传中…' : label }}</span>
    </label>

    <p v-if="error" class="m-state m-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.image-item {
  position: relative;
  width: 88px;
  height: 66px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
}
.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  padding: 0;
}
.image-pick input {
  display: none;
}
.image-pick span {
  display: inline-block;
  border: 1px dashed var(--line);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
}
.image-pick span:hover {
  border-color: var(--green-500);
  color: var(--green-700);
}
</style>
