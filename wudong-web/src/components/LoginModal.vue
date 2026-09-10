<script setup lang="ts">
import { ref } from 'vue'
import { useSession } from '../stores/session'
import { memberApi } from '../api/member'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const session = useSession()
const tab = ref<'password' | 'sms'>('password')
const phone = ref('')
const password = ref('')
const smsCode = ref('')
const devCode = ref('')
const busy = ref(false)
const err = ref('')

function close() {
  err.value = ''
  emit('close')
}

async function sendCode() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    err.value = '手机号格式不正确'
    return
  }
  const r = await memberApi.sendSmsCode(phone.value)
  // dev 环境验证码回显，演示时直接展示
  devCode.value = r?.code || ''
  err.value = devCode.value ? `演示环境验证码：${devCode.value}` : '验证码已发送'
}

async function submit() {
  if (busy.value) return
  busy.value = true
  err.value = ''
  try {
    if (tab.value === 'password') {
      await session.loginByPassword(phone.value, password.value)
    } else {
      await session.loginBySms(phone.value, smsCode.value)
    }
    close()
  } catch (e: any) {
    err.value = e?.message || '登录失败'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div v-if="open" class="mask" @click.self="close">
    <div class="modal card">
      <button class="close" @click="close">✕</button>
      <b class="title">🔐 登录乌东文旅</b>
      <div class="tabs">
        <span class="pill t" :class="{ on: tab === 'password' }" @click="tab = 'password'">密码登录</span>
        <span class="pill t" :class="{ on: tab === 'sms' }" @click="tab = 'sms'">验证码登录</span>
      </div>
      <input v-model="phone" class="ipt" placeholder="手机号" maxlength="11" />
      <input
        v-if="tab === 'password'"
        v-model="password"
        class="ipt"
        type="password"
        placeholder="密码（8-20 位字母+数字）"
      />
      <div v-else class="sms-row">
        <input v-model="smsCode" class="ipt" placeholder="验证码" maxlength="6" />
        <button class="send" @click="sendCode">获取验证码</button>
      </div>
      <div v-if="err" class="tip" :class="{ ok: err.startsWith('演示') }">{{ err }}</div>
      <button class="btn-primary confirm" :disabled="busy" @click="submit">
        {{ busy ? '登录中…' : '登录 / 自动注册' }}
      </button>
      <div class="hint">演示账号：13800000001 · 密码 abc123456</div>
    </div>
  </div>
</template>

<style scoped>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 60; }
.modal { width: 360px; padding: 18px; position: relative; }
.close { position: absolute; top: 10px; right: 12px; background: none; font-size: 14px; color: var(--text-3); }
.title { font-size: 15px; }
.tabs { display: flex; gap: 8px; margin: 12px 0; }
.t { background: #f2f2f2; cursor: pointer; }
.t.on { background: var(--green-600); color: #fff; }
.ipt { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 9px 12px; font: inherit; margin-bottom: 10px; box-sizing: border-box; }
.sms-row { display: flex; gap: 8px; }
.sms-row .ipt { flex: 1; }
.send { border: 1px solid var(--green-600); color: var(--green-600); background: #fff; border-radius: 8px; padding: 0 12px; font-size: 12px; cursor: pointer; white-space: nowrap; }
.tip { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 7px 10px; font-size: 12px; margin-bottom: 10px; }
.tip.ok { background: var(--ok-bg); color: var(--ok-text); }
.confirm { width: 100%; }
.confirm:disabled { opacity: .5; cursor: not-allowed; }
.hint { font-size: 11px; color: var(--text-3); text-align: center; margin-top: 10px; }
</style>
