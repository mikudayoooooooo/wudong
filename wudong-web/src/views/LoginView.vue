<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const form = reactive({ phone: '', password: '' });
const submitting = ref(false);
const error = ref('');

async function submit(): Promise<void> {
  error.value = '';
  if (!form.phone || !form.password) {
    error.value = '请填写手机号与密码';
    return;
  }
  submitting.value = true;
  try {
    await auth.login(form.phone, form.password);
    const redirect = String(route.query.redirect || '/merchant');
    await router.replace(redirect);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="container">
    <section class="m-card" style="max-width: 380px; margin: 40px auto">
      <h2 class="m-card-title">商家登录</h2>
      <form @submit.prevent="submit">
        <div class="m-form-row">
          <label>手机号</label>
          <input v-model="form.phone" type="tel" placeholder="请输入手机号" />
        </div>
        <div class="m-form-row">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <p v-if="error" class="m-state m-error">{{ error }}</p>
        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="submitting">
            {{ submitting ? '登录中…' : '登录' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>
