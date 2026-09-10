<script setup lang="ts">
// 某个民宿的房型管理：列表 + 内联新增/编辑表单 + 二次确认删除 + 房态入口。
// 「零间房」等前端可判定的错误就地拦截，其余以后端 message 为准。
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  merchantHotelInfo,
  merchantRoomTypeDelete,
  merchantRoomTypePage,
  merchantRoomTypeSave,
} from '@/api/merchant';
import ImageUploader from '@/components/ImageUploader.vue';
import TagInput from '@/components/TagInput.vue';
import { fmtPrice } from '@/utils/format';
import type { MerchantRoomType, RoomTypeForm } from '@/api/types';

const FACILITY_SUGGESTIONS = ['WiFi', '空调', '独立卫浴', '电热毯', '浴缸', '投影仪'];

const route = useRoute();
const router = useRouter();

const hotelId = computed(() => Number(route.params.id));

const hotelName = ref('');
const list = ref<MerchantRoomType[]>([]);
const loading = ref(true);
const error = ref('');
const busy = ref(false);
const pendingDelete = ref<number | null>(null);
/** 请求序号：每次 load 自增；响应回来仅当仍是最新请求才写回（防慢响应乱序覆盖） */
let reqSeq = 0;

/** 数字输入框被清空时 v-model.number 会留下 ''，这里统一归为 null */
const toNullableNumber = (v: unknown): number | null =>
  v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v);

/** 表单态：images 在表单里恒为数组——RoomTypeForm 上它是可选的，
 *  而 ImageUploader 的 modelValue 是必填的 string[]，直接 v-model 会 TS2322 */
type RoomTypeFormState = RoomTypeForm & { images: string[] };

/** 表单：null = 关闭；否则为编辑目标（新增时为 undefined id） */
const editing = ref<RoomTypeFormState | null>(null);

const blankForm = (): RoomTypeFormState => ({
  hotelId: hotelId.value,
  name: '',
  bedType: '',
  area: null,
  maxGuests: 2,
  facilities: [],
  price: 0,
  stock: 1,
  images: [],
  status: 1,
});

async function load(): Promise<void> {
  const seq = ++reqSeq;
  loading.value = true;
  error.value = '';
  // 列表将整体刷新，上一轮的删除确认态失去意义（避免已删除的行仍挂着「确认删除」）
  pendingDelete.value = null;
  try {
    const [hotel, page] = await Promise.all([
      merchantHotelInfo(hotelId.value),
      merchantRoomTypePage(hotelId.value),
    ]);
    if (seq !== reqSeq) return; // 已发新请求，本响应过期，丢弃（不改 list / hotelName）
    hotelName.value = hotel.name;
    list.value = page.list;
  } catch (e) {
    if (seq !== reqSeq) return; // 过期请求的错误同样丢弃
    error.value = e instanceof Error ? e.message : '房型加载失败';
    list.value = [];
  } finally {
    if (seq === reqSeq) loading.value = false; // 仅最新请求控制 loading
  }
}

function startCreate(): void {
  error.value = '';
  editing.value = blankForm();
}

function startEdit(roomType: MerchantRoomType): void {
  error.value = '';
  editing.value = {
    id: roomType.id,
    hotelId: roomType.hotelId,
    name: roomType.name,
    bedType: roomType.bedType ?? '',
    area: roomType.area ?? null,
    maxGuests: Number(roomType.maxGuests) || 2,
    facilities: roomType.facilities ?? [],
    price: Number(roomType.price),
    stock: Number(roomType.stock),
    images: roomType.images ?? [],
    status: Number(roomType.status) === 0 ? 0 : 1,
  };
}

async function submit(): Promise<void> {
  if (busy.value) return; // 双击保护不依赖 :disabled 的刷新时机
  const form = editing.value;
  if (!form) return;
  error.value = '';

  if (!form.name.trim()) {
    error.value = '请填写房型名称';
    return;
  }
  if (!(Number(form.price) > 0)) {
    error.value = '房型价格必须大于 0';
    return;
  }
  if (!(Number(form.stock) >= 1)) {
    error.value = '房间数量至少为 1';
    return;
  }

  busy.value = true;
  try {
    await merchantRoomTypeSave({
      ...form,
      hotelId: hotelId.value,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      maxGuests: Number(form.maxGuests) || 2,
      area: toNullableNumber(form.area),
      status: Number(form.status),
    });
    editing.value = null;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败，请稍后重试';
  } finally {
    busy.value = false;
  }
}

async function confirmDelete(id: number): Promise<void> {
  if (busy.value) return; // 同上：不依赖 :disabled 的刷新时机
  error.value = '';
  busy.value = true;
  try {
    await merchantRoomTypeDelete(id);
    pendingDelete.value = null;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败';
  } finally {
    busy.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="m-card">
      <h2 class="m-card-title">
        {{ hotelName || '房型管理' }}
        <span class="m-actions">
          <button type="button" class="m-btn new-room-type" @click="startCreate">
            新增房型
          </button>
        </span>
      </h2>

      <!-- 错误 / 加载中 / 空态 / 表格互斥：失败时 list 也被清空，若空态与错误同级会同时出现 -->
      <p v-if="error" class="m-state m-error">{{ error }}</p>

      <div v-else-if="loading" class="m-state">正在加载房型…</div>

      <p v-else-if="!list.length" class="m-state">
        还没有房型，点右上角「新增房型」为这家民宿添加房型。
      </p>

      <table v-else class="m-table">
        <thead>
          <tr>
            <th>房型</th>
            <th>床型</th>
            <th>可住</th>
            <th>价格</th>
            <th>房间数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="roomType in list" :key="roomType.id">
            <td>{{ roomType.name }}</td>
            <td>{{ roomType.bedType || '—' }}</td>
            <td>{{ roomType.maxGuests }} 人</td>
            <td>¥{{ fmtPrice(roomType.price) }}</td>
            <td>{{ roomType.stock }}</td>
            <td>{{ Number(roomType.status) === 1 ? '正常' : '停用' }}</td>
            <td class="row-actions">
              <button type="button" class="link edit-room-type" @click="startEdit(roomType)">
                编辑
              </button>
              <button
                type="button"
                class="link manage-calendar"
                @click="router.push({ name: 'merchant-room-calendar', params: { id: roomType.id }, query: { hotelId } })"
              >
                房态
              </button>

              <template v-if="pendingDelete === roomType.id">
                <span class="m-hint">确认删除？</span>
                <button
                  type="button"
                  class="link danger confirm-delete-room"
                  :disabled="busy"
                  @click="confirmDelete(roomType.id)"
                >
                  确认删除
                </button>
                <button type="button" class="link" @click="pendingDelete = null">取消</button>
              </template>
              <button
                v-else
                type="button"
                class="link danger delete-room-type"
                @click="pendingDelete = roomType.id"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="editing" class="m-card">
      <h2 class="m-card-title">{{ editing.id ? '编辑房型' : '新增房型' }}</h2>
      <form class="room-type-form" @submit.prevent="submit">
        <div class="m-form-grid">
          <div class="m-form-row field-room-name">
            <label>房型名称<span class="m-required">*</span></label>
            <input v-model="editing.name" type="text" placeholder="如 苗寨大床房" />
          </div>
          <div class="m-form-row field-room-bedType">
            <label>床型</label>
            <input v-model="editing.bedType" type="text" placeholder="如 大床 / 双床" />
          </div>
          <div class="m-form-row field-room-price">
            <label>基础价格（元）<span class="m-required">*</span></label>
            <input v-model.number="editing.price" type="number" min="0" step="1" />
          </div>
          <div class="m-form-row field-room-stock">
            <label>房间数量<span class="m-required">*</span></label>
            <input v-model.number="editing.stock" type="number" min="1" step="1" />
          </div>
          <div class="m-form-row field-room-area">
            <label>面积（㎡）</label>
            <input v-model.number="editing.area" type="number" min="0" step="1" />
          </div>
          <div class="m-form-row field-room-maxGuests">
            <label>最多入住</label>
            <input v-model.number="editing.maxGuests" type="number" min="1" step="1" />
          </div>
          <div class="m-form-row field-room-status">
            <label>状态</label>
            <select v-model.number="editing.status">
              <option :value="1">正常</option>
              <option :value="0">停用</option>
            </select>
          </div>
        </div>

        <div class="m-form-row field-room-facilities">
          <label>房间设施</label>
          <TagInput v-model="editing.facilities" :suggestions="FACILITY_SUGGESTIONS" />
        </div>
        <div class="m-form-row field-room-images">
          <label>房型图片</label>
          <ImageUploader v-model="editing.images" :max="4" label="上传房型图片" />
        </div>

        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="busy">
            {{ busy ? '保存中…' : '保存' }}
          </button>
          <button type="button" class="m-btn m-btn-ghost" @click="editing = null">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 操作列与文字按钮。这几个类在 Task 13 的民宿列表里是 <style scoped> 的，
   而 scoped CSS 到不了本组件 —— 所以这里必须自带一份定义，否则编辑/房态/删除
   会退化成浏览器默认按钮、操作列也丢掉 flex 布局（测试只断言 .exists()，抓不到）。 */
.row-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.link {
  border: 0;
  background: transparent;
  color: var(--green-500);
  font-size: 13px;
  padding: 0;
  text-decoration: underline;
}
.link.danger {
  color: var(--gold-600);
}
.link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
