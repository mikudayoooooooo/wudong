<script setup lang="ts">
// 民宿新增/编辑：同一表单，按路由是否带 id 决定模式。经纬度必填（后端校验），
// 标签与图片用 TagInput / ImageUploader；保存成功回列表。
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { merchantHotelInfo, merchantHotelSave } from '@/api/merchant';
import ImageUploader from '@/components/ImageUploader.vue';
import TagInput from '@/components/TagInput.vue';
import type { HotelForm } from '@/api/types';

const route = useRoute();
const router = useRouter();

/** 数字输入框被清空时 v-model.number 会留下 ''：空/无法解析一律算未填 */
const isUnfilledNumber = (v: unknown): boolean =>
  v === '' || v == null || Number.isNaN(Number(v));

const STYLE_SUGGESTIONS = ['苗寨', '江景', '山景', '观星', '家庭', '经济'];
const FACILITY_SUGGESTIONS = ['WiFi', '空调', '独立卫浴', '电热毯', '儿童设施', '停车位'];

const hotelId = computed(() => {
  const raw = route.params.id;
  return raw ? Number(raw) : undefined;
});
const isEdit = computed(() => hotelId.value !== undefined);

const form = reactive<HotelForm>({
  name: '',
  address: '',
  longitude: 0,
  latitude: 0,
  styleTags: [],
  facilityTags: [],
  mainImage: '',
  images: [],
  intro: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '',
  hasBreakfast: 0,
  deposit: 0,
  status: 1,
});

/** 主图与图集共用 ImageUploader，这里用单元素数组桥接（主图取第 0 张） */
const mainImageList = ref<string[]>([]);
const imageList = ref<string[]>([]);

const loading = ref(false);
const submitting = ref(false);
const error = ref('');

async function load(): Promise<void> {
  if (hotelId.value === undefined) return;
  loading.value = true;
  error.value = '';
  try {
    const info = await merchantHotelInfo(hotelId.value);
    Object.assign(form, {
      id: info.id,
      name: info.name,
      address: info.address,
      longitude: Number(info.longitude),
      latitude: Number(info.latitude),
      styleTags: info.styleTags ?? [],
      facilityTags: info.facilityTags ?? [],
      mainImage: info.mainImage ?? '',
      images: info.images ?? [],
      intro: info.intro ?? '',
      checkInTime: info.checkInTime || '14:00',
      checkOutTime: info.checkOutTime || '12:00',
      petPolicy: info.petPolicy ?? '',
      hasBreakfast: Number(info.hasBreakfast) === 1 ? 1 : 0,
      deposit: Number(info.deposit) || 0,
      status: Number(info.status) === 0 ? 0 : 1,
    });
    mainImageList.value = form.mainImage ? [form.mainImage] : [];
    imageList.value = form.images ? form.images.slice() : [];
  } catch (e) {
    error.value = e instanceof Error ? e.message : '民宿信息加载失败';
  } finally {
    loading.value = false;
  }
}

async function submit(): Promise<void> {
  error.value = '';
  form.mainImage = mainImageList.value[0] ?? '';
  form.images = imageList.value.slice();

  if (!form.name.trim() || !form.address.trim()) {
    error.value = '请填写民宿名称与地址';
    return;
  }
  // 数字输入框被清空时 v-model.number 会留下 ''，而 Number('') === 0：
  // 只看 isFinite 会把空输入当成合法坐标，落库成 (0, 0)。0 在这里一律视为未填写。
  if (
    isUnfilledNumber(form.longitude) ||
    isUnfilledNumber(form.latitude) ||
    (Number(form.longitude) === 0 && Number(form.latitude) === 0)
  ) {
    error.value = '请填写经纬度（不能为空或 0）';
    return;
  }

  submitting.value = true;
  try {
    await merchantHotelSave({
      ...form,
      name: form.name.trim(),
      address: form.address.trim(),
      longitude: Number(form.longitude),
      latitude: Number(form.latitude),
      deposit: Number(form.deposit) || 0,
      hasBreakfast: Number(form.hasBreakfast),
      status: Number(form.status),
      id: hotelId.value,
    });
    await router.push({ name: 'merchant-hotels' });
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="m-card">
    <h2 class="m-card-title">{{ isEdit ? '编辑民宿' : '新增民宿' }}</h2>

    <div v-if="loading" class="m-state">正在加载民宿信息…</div>

    <form v-else @submit.prevent="submit">
      <div class="m-form-grid">
        <div class="m-form-row field-name">
          <label>民宿名称<span class="m-required">*</span></label>
          <input v-model="form.name" type="text" placeholder="如 乌东苗寨木楼" />
        </div>
        <div class="m-form-row field-address">
          <label>地址<span class="m-required">*</span></label>
          <input v-model="form.address" type="text" placeholder="如 雷山县 · 乌东村一组" />
        </div>
        <div class="m-form-row field-longitude">
          <label>经度<span class="m-required">*</span></label>
          <input v-model="form.longitude" type="number" step="0.000001" />
        </div>
        <div class="m-form-row field-latitude">
          <label>纬度<span class="m-required">*</span></label>
          <input v-model="form.latitude" type="number" step="0.000001" />
        </div>
        <div class="m-form-row field-checkInTime">
          <label>入住时间</label>
          <input v-model="form.checkInTime" type="text" placeholder="14:00" />
        </div>
        <div class="m-form-row field-checkOutTime">
          <label>离店时间</label>
          <input v-model="form.checkOutTime" type="text" placeholder="12:00" />
        </div>
        <div class="m-form-row field-hasBreakfast">
          <label>是否含早</label>
          <select v-model.number="form.hasBreakfast">
            <option :value="1">含早餐</option>
            <option :value="0">不含早餐</option>
          </select>
        </div>
        <div class="m-form-row field-deposit">
          <label>押金（元）</label>
          <input v-model.number="form.deposit" type="number" min="0" step="1" />
        </div>
        <div class="m-form-row field-status">
          <label>上架状态</label>
          <select v-model.number="form.status">
            <option :value="1">上架</option>
            <option :value="0">下架</option>
          </select>
        </div>
        <div class="m-form-row field-petPolicy">
          <label>宠物政策</label>
          <input v-model="form.petPolicy" type="text" placeholder="如 可携带小型宠物" />
        </div>
      </div>

      <div class="m-form-row field-styleTags">
        <label>风格标签</label>
        <TagInput v-model="form.styleTags" :suggestions="STYLE_SUGGESTIONS" />
      </div>
      <div class="m-form-row field-facilityTags">
        <label>设施标签</label>
        <TagInput v-model="form.facilityTags" :suggestions="FACILITY_SUGGESTIONS" />
      </div>
      <div class="m-form-row field-mainImage">
        <label>主图</label>
        <ImageUploader v-model="mainImageList" :max="1" label="上传主图" />
      </div>
      <div class="m-form-row field-images">
        <label>图集</label>
        <ImageUploader v-model="imageList" :max="6" label="上传图集" />
      </div>
      <div class="m-form-row field-intro">
        <label>民宿介绍</label>
        <textarea v-model="form.intro" rows="4" placeholder="一句话介绍这家民宿"></textarea>
      </div>

      <p v-if="error" class="m-state m-error">{{ error }}</p>

      <div class="m-form-actions">
        <button class="m-btn" type="submit" :disabled="submitting">
          {{ submitting ? '保存中…' : '保存' }}
        </button>
        <button
          type="button"
          class="m-btn m-btn-ghost"
          @click="router.push({ name: 'merchant-hotels' })"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>
