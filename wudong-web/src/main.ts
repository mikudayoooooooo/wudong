import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { setAuthToken, setUnauthorizedHandler } from './api/http';
import './styles/base.scss';
import './styles/merchant.scss';

const app = createApp(App).use(createPinia()).use(router);

// 恢复持久化 token → http 层；鉴权失效时清登录态并跳登录页
const auth = useAuthStore();
setAuthToken(auth.token || null);
setUnauthorizedHandler(() => {
  auth.logout();
  const current = router.currentRoute.value;
  if (current.path !== '/login') {
    // 带上来源（与路由守卫一致），重登后回到被踢出的页面
    router.push({ name: 'login', query: { redirect: current.fullPath } });
  }
});

app.mount('#app');
