import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import HotelListView from '../views/accommodation/HotelListView.vue';
import HotelDetailView from '../views/accommodation/HotelDetailView.vue';

// 路由现状：/ 已是真实首页（Task 4）；/hotels 已是真实列表页（Task 5）；/hotels/:id 为真实详情页（Task 6）。
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/hotels', name: 'hotels', component: HotelListView },
    { path: '/hotels/:id', name: 'hotel-detail', component: HotelDetailView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
