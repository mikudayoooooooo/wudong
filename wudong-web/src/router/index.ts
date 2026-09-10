import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import HotelListView from '../views/accommodation/HotelListView.vue';
import HotelDetailView from '../views/accommodation/HotelDetailView.vue';
import MerchantShell from '../views/merchant/MerchantShell.vue';
import { useAuthStore } from '../stores/auth';

// 路由现状：/ 已是真实首页（Task 4）；/hotels 已是真实列表页（Task 5）；/hotels/:id 为真实详情页（Task 6）；
// /login 与 /merchant 外壳为 Task 9 接入，商家区子路由由 Task 12–16 逐个追加。
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/hotels', name: 'hotels', component: HotelListView },
    { path: '/hotels/:id', name: 'hotel-detail', component: HotelDetailView },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/merchant',
      name: 'merchant',
      component: MerchantShell,
      meta: { requiresAuth: true },
      children: [
        // 后续 Task 逐个追加子路由（只改这一段）
        {
          path: '',
          name: 'merchant-home',
          component: () => import('../views/merchant/MerchantHomeView.vue'),
        },
        {
          path: 'apply',
          name: 'merchant-apply',
          component: () => import('../views/merchant/MerchantApplyView.vue'),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// 登录守卫：/merchant/** 需要登录态；未登录跳登录页并记住来源
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
