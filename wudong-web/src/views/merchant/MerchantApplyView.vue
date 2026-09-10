<script setup lang="ts">
// 入驻申请三态：已入驻（引导回首页）/ 待审核（只读展示）/ 可提交（表单，被驳回时预填并显示原因）。
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { merchantApplication, merchantApply, merchantMy } from '@/api/merchant';
import ImageUploader from '@/components/ImageUploader.vue';
import { useAuthStore } from '@/stores/auth';
import { MODULE_OPTIONS, applicationStatusText } from '@/utils/merchant';
import type { MerchantApplication, MerchantApplyForm } from '@/api/types';

const auth = useAuthStore();
const router = useRouter();

const application = ref<MerchantApplication | null>(null);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');
const notice = ref('');

const form = reactive<MerchantApplyForm & { idCardFrontList: string[]; idCardBackList: string[]; licenseList: string[] }>({
  shopName: '',
  module: 'accommodation',
  contactName: '',
  contactPhone: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
  businessLicense: '',
  idCardFrontList: [],
  idCardBackList: [],
  licenseList: [],
});

/** 待审核或已入驻时不显示表单 */
const showForm = ref(false);

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const [merchant, progress] = await Promise.all([
      merchantMy(),
      merchantApplication(),
    ]);
    auth.merchant = merchant;
    application.value = progress;

    if (merchant) {
      showForm.value = false;
      return;
    }
    if (progress && Number(progress.status) === 1) {
      showForm.value = false;
      return;
    }
    // 无申请或被驳回 → 可提交；被驳回时用上次资料预填
    if (progress) {
      form.shopName = progress.shopName;
      form.module = progress.module;
      form.contactName = progress.contactName;
      form.contactPhone = progress.contactPhone;
      form.idCard = progress.idCard;
    } else {
      form.contactPhone = auth.member?.phone ?? '';
    }
    showForm.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '入驻信息加载失败';
  } finally {
    loading.value = false;
  }
}

function syncImages(): void {
  form.idCardFront = form.idCardFrontList[0] ?? '';
  form.idCardBack = form.idCardBackList[0] ?? '';
  form.businessLicense = form.licenseList[0] ?? '';
}

async function submit(): Promise<void> {
  error.value = '';
  notice.value = '';
  syncImages();

  if (
    !form.shopName.trim() ||
    !form.contactName.trim() ||
    !form.contactPhone.trim() ||
    !form.idCard.trim() ||
    !form.idCardFront ||
    !form.idCardBack ||
    !form.businessLicense
  ) {
    error.value = '请填写完整的入驻信息';
    return;
  }

  submitting.value = true;
  try {
    await merchantApply({
      shopName: form.shopName.trim(),
      module: form.module,
      contactName: form.contactName.trim(),
      contactPhone: form.contactPhone.trim(),
      idCard: form.idCard.trim(),
      idCardFront: form.idCardFront,
      idCardBack: form.idCardBack,
      businessLicense: form.businessLicense,
    });
    notice.value = '入驻申请已提交，请等待平台审核';
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '提交失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div v-if="loading" class="m-card m-state">正在加载入驻信息…</div>

    <template v-else>
      <div v-if="error && !showForm" class="m-card m-state m-error">{{ error }}</div>

      <!-- 已入驻 -->
      <div v-if="auth.merchant" class="m-card">
        <h2 class="m-card-title">已入驻</h2>
        <p class="m-hint">
          店铺「{{ auth.merchant.shopName }}」已通过审核，无需重复申请。
        </p>
        <div class="m-form-actions">
          <button
            type="button"
            class="m-btn"
            @click="router.push({ name: 'merchant-home' })"
          >
            返回店铺概览
          </button>
        </div>
      </div>

      <!-- 待审核 -->
      <div v-else-if="application && Number(application.status) === 1" class="m-card">
        <h2 class="m-card-title">入驻申请审核中</h2>
        <table class="m-table">
          <tbody>
            <tr>
              <th>店铺名称</th>
              <td>{{ application.shopName }}</td>
            </tr>
            <tr>
              <th>联系人</th>
              <td>{{ application.contactName }} {{ application.contactPhone }}</td>
            </tr>
            <tr>
              <th>当前状态</th>
              <td>{{ applicationStatusText(application.status) }}</td>
            </tr>
          </tbody>
        </table>
        <p class="m-hint">平台审核完成后会通过站内消息通知你。</p>
      </div>

      <!-- 表单（无申请 / 已驳回） -->
      <div v-else-if="showForm" class="m-card">
        <h2 class="m-card-title">
          {{ application ? '重新提交入驻申请' : '入驻申请' }}
        </h2>

        <p v-if="application?.auditResult" class="m-state m-error">
          上次审核意见：{{ application.auditResult }}
        </p>
        <p v-if="notice" class="m-hint">{{ notice }}</p>

        <form class="apply-form" @submit.prevent="submit">
          <div class="m-form-grid">
            <div class="m-form-row field-shopName">
              <label>店铺名称<span class="m-required">*</span></label>
              <input v-model="form.shopName" type="text" placeholder="如 苗银世家" />
            </div>
            <div class="m-form-row field-module">
              <label>入驻模块<span class="m-required">*</span></label>
              <select v-model="form.module">
                <option v-for="item in MODULE_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="m-form-row field-contactName">
              <label>联系人<span class="m-required">*</span></label>
              <input v-model="form.contactName" type="text" placeholder="请输入联系人姓名" />
            </div>
            <div class="m-form-row field-contactPhone">
              <label>联系电话<span class="m-required">*</span></label>
              <input v-model="form.contactPhone" type="tel" placeholder="11 位手机号" />
            </div>
            <div class="m-form-row field-idCard">
              <label>身份证号<span class="m-required">*</span></label>
              <input v-model="form.idCard" type="text" placeholder="18 位身份证号" />
            </div>
          </div>

          <div class="m-form-row field-idCardFront">
            <label>身份证正面<span class="m-required">*</span></label>
            <ImageUploader v-model="form.idCardFrontList" :max="1" label="上传身份证正面" />
          </div>
          <div class="m-form-row field-idCardBack">
            <label>身份证反面<span class="m-required">*</span></label>
            <ImageUploader v-model="form.idCardBackList" :max="1" label="上传身份证反面" />
          </div>
          <div class="m-form-row field-businessLicense">
            <label>营业执照<span class="m-required">*</span></label>
            <ImageUploader v-model="form.licenseList" :max="1" label="上传营业执照" />
          </div>

          <p v-if="error" class="m-state m-error">{{ error }}</p>

          <div class="m-form-actions">
            <button class="m-btn" type="submit" :disabled="submitting">
              {{ submitting ? '提交中…' : '提交申请' }}
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
