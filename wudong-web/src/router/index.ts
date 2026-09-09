import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';

// 三条路由先统一指向 HomeView 占位，Task 4/5/6 依次替换为真实视图：
//   /            → HomeView        （Task 4 真实首页）
//   /hotels      → HotelListView   （Task 5）
//   /hotels/:id  → HotelDetailView（Task 6）
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
