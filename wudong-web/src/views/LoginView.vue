<script setup lang="ts">
// 商家登录页：登录 / 注册 两态。注册需短信验证码；本地与测试环境后端把验证码放在
// 返回值里（无短信通道），因此发送后直接回填并提示，方便演示与联调。
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { sendSmsCode } from '@/api/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const mode = ref<'login' | 'register'>('login');
const form = reactive({ phone: '', password: '', smsCode: '' });
const submitting = ref(false);
const sending = ref(false);
const error = ref('');
const notice = ref('');

const submitLabel = computed(() =>
  mode.value === 'login' ? '登录' : '注册并登录'
);

/** 与后端 member/service/login.ts 完全一致的密码规则（8–20 位且同时含字母和数字） */
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[\s\S]{8,20}$/;
/** 逐字照抄后端文案，前后端同一句话 */
const PASSWORD_RULE_MESSAGE = '密码须为8-20位，且同时包含字母和数字';

/** 只接受站内绝对路径作为 redirect，挡掉 `//evil.com` 之类的站外地址 */
function safeRedirect(): string {
  const raw = route.query.redirect;
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return '/merchant';
}

function switchMode(next: 'login' | 'register'): void {
  mode.value = next;
  error.value = '';
  notice.value = '';
}

/** 本地环境后端会直接返回验证码，回填+提示；线上（无 code）则提示去查短信 */
async function onSendCode(): Promise<void> {
  error.value = '';
  notice.value = '';
  if (!form.phone) {
    error.value = '请先填写手机号';
    return;
  }
  sending.value = true;
  try {
    const result = await sendSmsCode(form.phone);
    if (result?.code) {
      form.smsCode = result.code;
      notice.value = `验证码已发送（当前环境验证码：${result.code}）`;
    } else {
      notice.value = '验证码已发送，请查看短信';
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '验证码发送失败';
  } finally {
    sending.value = false;
  }
}

async function submit(): Promise<void> {
  error.value = '';
  if (!form.phone || !form.password) {
    error.value = '请填写手机号与密码';
    return;
  }
  if (mode.value === 'register' && !form.smsCode) {
    error.value = '请填写短信验证码';
    return;
  }
  // 注册态本地先拦一道与后端同规则的密码校验，避免只靠后端报错（spec §5.2 前后端一致）
  if (mode.value === 'register' && !PASSWORD_RULE.test(form.password)) {
    error.value = PASSWORD_RULE_MESSAGE;
    return;
  }
  submitting.value = true;
  try {
    if (mode.value === 'login') {
      await auth.login(form.phone, form.password);
    } else {
      await auth.registerAndLogin({
        phone: form.phone,
        smsCode: form.smsCode,
        password: form.password,
      });
    }
    await router.replace(safeRedirect());
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="container">
    <section class="m-card login-card">
      <h2 class="m-card-title">商家中心</h2>

      <div class="login-tab">
        <button
          type="button"
          :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >
          登录
        </button>
        <button
          type="button"
          :class="{ active: mode === 'register' }"
          @click="switchMode('register')"
        >
          注册
        </button>
      </div>

      <form @submit.prevent="submit">
        <div class="m-form-row">
          <label>手机号<span class="m-required">*</span></label>
          <input v-model="form.phone" type="tel" placeholder="请输入手机号" />
        </div>

        <div v-if="mode === 'register'" class="m-form-row">
          <label>短信验证码<span class="m-required">*</span></label>
          <div class="sms-code-row">
            <input
              v-model="form.smsCode"
              class="sms-code-input"
              type="text"
              placeholder="请输入验证码"
            />
            <button
              type="button"
              class="m-btn m-btn-ghost send-code"
              :disabled="sending"
              @click="onSendCode"
            >
              {{ sending ? '发送中…' : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="m-form-row">
          <label>密码<span class="m-required">*</span></label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>

        <p v-if="notice" class="m-hint">{{ notice }}</p>
        <p v-if="error" class="m-state m-error">{{ error }}</p>

        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="submitting">
            {{ submitting ? '提交中…' : submitLabel }}
          </button>
        </div>
      </form>

      <p class="m-hint login-foot">
        商家中心面向入驻商户；游客浏览请返回
        <router-link to="/">首页</router-link>。
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 40px auto;
}
.login-tab {
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
}
.login-tab button {
  flex: 1;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--muted);
}
.login-tab button.active {
  border-color: var(--green-700);
  background: var(--green-700);
  color: #fff;
}
.sms-code-row {
  display: flex;
  gap: 8px;
}
.sms-code-row input {
  flex: 1;
  min-width: 0;
}
.login-foot {
  margin: 16px 0 0;
}
.login-foot a {
  color: var(--green-500);
  text-decoration: underline;
}
</style>
