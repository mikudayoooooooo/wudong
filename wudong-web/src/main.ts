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
  if (router.currentRoute.value.path !== '/login') {
    router.push({ name: 'login' });
  }
});

app.mount('#app');
