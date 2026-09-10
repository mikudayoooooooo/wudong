<script setup lang="ts">
// 我的民宿：列表 + 状态筛选 + 上下架 + 编辑 + 房型入口 + 二次确认删除。
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  merchantHotelDelete,
  merchantHotelPage,
  merchantHotelSetStatus,
} from '@/api/merchant';
import type { MerchantHotel } from '@/api/types';

const router = useRouter();

const list = ref<MerchantHotel[]>([]);
const loading = ref(true);
const error = ref('');
const name = ref('');
const status = ref<string>('');
/** 待确认删除的民宿 id；非空时该行显示确认按钮 */
const pendingDelete = ref<number | null>(null);
const busy = ref(false);
/** 请求序号：每次 load 自增；响应回来仅当仍是最新请求才写回 list（防慢响应乱序覆盖） */
let reqSeq = 0;

async function load(): Promise<void> {
  const seq = ++reqSeq;
  loading.value = true;
  error.value = '';
  // 列表将整体刷新，上一轮的删除确认态失去意义（避免已下架的行仍挂着「确认删除」）
  pendingDelete.value = null;
  try {
    const result = await merchantHotelPage({
      page: 1,
      size: 50,
      name: name.value.trim() || undefined,
      status: status.value === '' ? undefined : Number(status.value),
    });
    if (seq !== reqSeq) return; // 已发新请求，本响应过期，丢弃（不改 list）
    list.value = result.list;
  } catch (e) {
    if (seq !== reqSeq) return; // 过期请求的错误同样丢弃
    error.value = e instanceof Error ? e.message : '民宿加载失败';
    list.value = [];
  } finally {
    if (seq === reqSeq) loading.value = false; // 仅最新请求控制 loading
  }
}

async function toggleStatus(hotel: MerchantHotel): Promise<void> {
  if (busy.value) return; // 双击保护不依赖 :disabled 的刷新时机
  error.value = '';
  busy.value = true;
  try {
    await merchantHotelSetStatus(hotel.id, Number(hotel.status) === 1 ? 0 : 1);
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败';
  } finally {
    busy.value = false;
  }
}

async function confirmDelete(id: number): Promise<void> {
  if (busy.value) return; // 双击保护不依赖 :disabled 的刷新时机
  error.value = '';
  busy.value = true;
  try {
    await merchantHotelDelete(id);
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
        我的民宿
        <span class="m-actions">
          <button
            type="button"
            class="m-btn new-hotel"
            @click="router.push({ name: 'merchant-hotel-new' })"
          >
            新增民宿
          </button>
        </span>
      </h2>

      <div class="hotel-filters">
        <input
          v-model="name"
          type="text"
          aria-label="按名称搜索民宿"
          placeholder="按名称搜索"
          @keyup.enter="load"
        />
        <select v-model="status" aria-label="按状态筛选" @change="load">
          <option value="">全部状态</option>
          <option value="1">已上架</option>
          <option value="0">已下架</option>
        </select>
        <button type="button" class="m-btn m-btn-ghost" @click="load">查询</button>
      </div>

      <!-- 错误 / 加载中 / 空态 / 表格互斥：失败时 list 也被清空，若空态与错误同级会同时出现 -->
      <p v-if="error" class="m-state m-error">{{ error }}</p>

      <div v-else-if="loading" class="m-state">正在加载民宿…</div>

      <p v-else-if="!list.length" class="m-state">
        还没有民宿，点右上角「新增民宿」创建第一家吧。
      </p>

      <table v-else class="m-table">
        <thead>
          <tr>
            <th>民宿名称</th>
            <th>地址</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hotel in list" :key="hotel.id">
            <td>{{ hotel.name }}</td>
            <td>{{ hotel.address }}</td>
            <td>{{ Number(hotel.status) === 1 ? '已上架' : '已下架' }}</td>
            <td class="row-actions">
              <button
                type="button"
                class="link edit-hotel"
                @click="router.push({ name: 'merchant-hotel-edit', params: { id: hotel.id } })"
              >
                编辑
              </button>
              <button
                type="button"
                class="link manage-rooms"
                @click="router.push({ name: 'merchant-hotel-rooms', params: { id: hotel.id } })"
              >
                房型
              </button>
              <button
                type="button"
                class="link toggle-status"
                :disabled="busy"
                @click="toggleStatus(hotel)"
              >
                {{ Number(hotel.status) === 1 ? '下架' : '上架' }}
              </button>

              <template v-if="pendingDelete === hotel.id">
                <span class="m-hint">确认删除？</span>
                <button
                  type="button"
                  class="link danger confirm-delete"
                  :disabled="busy"
                  @click="confirmDelete(hotel.id)"
                >
                  确认删除
                </button>
                <button type="button" class="link" @click="pendingDelete = null">
                  取消
                </button>
              </template>
              <button
                v-else
                type="button"
                class="link danger delete-hotel"
                @click="pendingDelete = hotel.id"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.hotel-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.hotel-filters input,
.hotel-filters select {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
}
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
