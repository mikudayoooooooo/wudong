import { createRouter, createWebHistory, type Router } from 'vue-router'

export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: () => import('../views/HomeView.vue') },
      { path: '/route', component: () => import('../views/RouteListView.vue') },
      { path: '/scenic', component: () => import('../views/ScenicListView.vue') },
      { path: '/route/:id', component: () => import('../views/RouteDetailView.vue') },
      { path: '/scenic/:id', component: () => import('../views/ScenicDetailView.vue') },
      { path: '/guide', component: () => import('../views/GuideView.vue') },
      { path: '/community', component: () => import('../views/CommunityView.vue') },
      { path: '/post/:id', component: () => import('../views/PostDetailView.vue') },
      { path: '/:pathMatch(.*)*', component: { template: '<div style="padding:60px">404</div>' } },
    ],
  })
}
