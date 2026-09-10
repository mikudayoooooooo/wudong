<script setup lang="ts">
// 商家首页：店铺概览 + 入驻进度 + 快捷入口。数据来自 merchantMy / merchantApplication，
// 加载成功后回写 auth store，供外壳导航与其它页面复用。
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { merchantApplication, merchantMy } from '@/api/merchant';
import { useAuthStore } from '@/stores/auth';
import { applicationStatusText, moduleLabel } from '@/utils/merchant';
import type { MerchantApplication } from '@/api/types';

const auth = useAuthStore();
const router = useRouter();

const application = ref<MerchantApplication | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const [merchant, progress] = await Promise.all([
      merchantMy(),
      merchantApplication(),
    ]);
    auth.merchant = merchant;
    application.value = progress;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '店铺信息加载失败';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading" class="m-card m-state">正在加载店铺信息…</div>

    <div v-else-if="error" class="m-card m-state m-error">{{ error }}</div>

    <div v-else-if="auth.merchant" class="m-card">
      <h2 class="m-card-title">我的店铺</h2>
      <table class="m-table">
        <tbody>
          <tr>
            <th>店铺名称</th>
            <td>{{ auth.merchant.shopName }}</td>
          </tr>
          <tr>
            <th>入驻模块</th>
            <td>{{ moduleLabel(auth.merchant.module) }}</td>
          </tr>
          <tr>
            <th>商家账号</th>
            <td>{{ auth.merchant.username }}</td>
          </tr>
          <tr>
            <th>联系人</th>
            <td>{{ auth.merchant.contactName }} {{ auth.merchant.contactPhone }}</td>
          </tr>
          <tr>
            <th>入驻时间</th>
            <td>{{ auth.merchant.joinedAt || '—' }}</td>
          </tr>
          <tr>
            <th>店铺状态</th>
            <td>{{ Number(auth.merchant.status) === 1 ? '正常营业' : '已禁用' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="m-form-actions">
        <button
          v-if="auth.merchant.module === 'accommodation'"
          type="button"
          class="m-btn"
          @click="router.push({ name: 'merchant-hotels' })"
        >
          我的民宿
        </button>
        <span v-else class="m-hint">
          当前入驻模块为{{ moduleLabel(auth.merchant.module) }}，新增民宿仅对住宿模块商家开放。
        </span>
      </div>
    </div>

    <div v-else class="m-card">
      <h2 class="m-card-title">入驻进度</h2>

      <template v-if="application">
        <p class="m-hint">
          申请店铺「{{ application.shopName }}」当前状态：
          <strong>{{ applicationStatusText(application.status) }}</strong>
        </p>
        <p v-if="application.auditResult" class="m-state m-error">
          审核意见：{{ application.auditResult }}
        </p>
      </template>
      <p v-else class="m-hint">尚未入驻，提交入驻申请后即可管理自己的民宿。</p>

      <div class="m-form-actions">
        <button
          type="button"
          class="m-btn go-apply"
          @click="router.push({ name: 'merchant-apply' })"
        >
          {{ application && Number(application.status) === 1 ? '查看入驻申请' : '去入驻申请' }}
        </button>
      </div>
    </div>
  </div>
</template>
