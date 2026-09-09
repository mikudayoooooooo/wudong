import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';

// 路由现状：/ 已是真实首页（Task 4）；/hotels、/hotels/:id 暂仍指向 HomeView 占位，Task 5/6 依次替换为真实视图。
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/hotels', name: 'hotels', component: HomeView },
    { path: '/hotels/:id', name: 'hotel-detail', component: HomeView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
