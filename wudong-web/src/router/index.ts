import { createRouter, createWebHistory, type Router } from 'vue-router'

export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
      { path: '/route', name: 'route-list', component: () => import('../views/RouteListView.vue') },
      { path: '/scenic', name: 'scenic-list', component: () => import('../views/ScenicListView.vue') },
      { path: '/route/:id', name: 'route-detail', component: () => import('../views/RouteDetailView.vue') },
      { path: '/scenic/:id', name: 'scenic-detail', component: () => import('../views/ScenicDetailView.vue') },
      { path: '/guide', name: 'guide', component: () => import('../views/GuideView.vue') },
      { path: '/community', name: 'community', component: () => import('../views/CommunityView.vue') },
      { path: '/hotels', name: 'hotel-list', component: () => import('../views/accommodation/HotelListView.vue') },
      { path: '/hotels/:id', name: 'hotel-detail', component: () => import('../views/accommodation/HotelDetailView.vue') },
      { path: '/products', name: 'products', component: () => import('../views/product/ProductListView.vue') },
      { path: '/products/:id', name: 'product-detail', component: () => import('../views/product/ProductDetailView.vue') },
      { path: '/restaurants', name: 'restaurants', component: () => import('../views/food/RestaurantListView.vue') },
      { path: '/restaurants/:id', name: 'restaurant-detail', component: () => import('../views/food/RestaurantDetailView.vue') },
      { path: '/farm-products', name: 'farm-products', component: () => import('../views/food/FarmProductListView.vue') },
      { path: '/farm-products/:id', name: 'farm-product-detail', component: () => import('../views/food/FarmProductDetailView.vue') },
      { path: '/cart', name: 'cart', component: () => import('../views/cart/CartView.vue'), meta: { requiresAuth: true } },
      { path: '/order/:orderNo', name: 'order-detail', component: () => import('../views/order/OrderDetailView.vue'), meta: { requiresAuth: true } },
      { path: '/post/:id', name: 'post-detail', component: () => import('../views/PostDetailView.vue') },
      { path: '/my/orders', name: 'my-orders', component: () => import('../views/my/MyOrdersView.vue'), meta: { requiresAuth: true } },
      { path: '/my/reservations', name: 'my-reservations', component: () => import('../views/my/MyReservationsView.vue'), meta: { requiresAuth: true } },
      { path: '/my/favorites', name: 'my-favorites', component: () => import('../views/my/MyFavoritesView.vue'), meta: { requiresAuth: true } },
      { path: '/my/tickets', name: 'my-tickets', component: () => import('../views/TicketsView.vue') },
      { path: '/publish', name: 'publish', component: () => import('../views/PublishView.vue') },
      { path: '/topic/:id', name: 'topic', component: () => import('../views/TopicView.vue') },
      { path: '/user/:id', name: 'user-profile', component: () => import('../views/UserProfileView.vue') },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div style="padding:60px">404</div>' } },
    ],
  })
}
