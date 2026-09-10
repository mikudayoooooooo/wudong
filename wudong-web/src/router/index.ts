import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import HotelListView from '../views/accommodation/HotelListView.vue';
import HotelDetailView from '../views/accommodation/HotelDetailView.vue';

// 路由现状：/ 已是真实首页（Task 4）；/hotels 已是真实列表页（Task 5）；/hotels/:id 为真实详情页（Task 6）。
// 新增：商品、餐饮、农产品路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    // 住宿模块（组员已完成）
    { path: '/hotels', name: 'hotels', component: HotelListView },
    { path: '/hotels/:id', name: 'hotel-detail', component: HotelDetailView },

    // 商品模块（新增）
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/product/ProductListView.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/product/ProductDetailView.vue'),
    },

    // 餐饮模块（新增）
    {
      path: '/restaurants',
      name: 'restaurants',
      component: () => import('../views/food/RestaurantListView.vue'),
    },
    {
      path: '/restaurants/:id',
      name: 'restaurant-detail',
      component: () => import('../views/food/RestaurantDetailView.vue'),
    },

    // 农产品模块（新增）
    {
      path: '/farm-products',
      name: 'farm-products',
      component: () => import('../views/food/FarmProductListView.vue'),
    },
    {
      path: '/farm-products/:id',
      name: 'farm-product-detail',
      component: () => import('../views/food/FarmProductDetailView.vue'),
    },

    // 购物车模块（新增）
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/cart/CartView.vue'),
      meta: { requiresAuth: true },
    },

    // 订单模块（新增）
    {
      path: '/order/:orderNo',
      name: 'order-detail',
      component: () => import('../views/order/OrderDetailView.vue'),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
