import { createRouter, createWebHistory, type Router } from 'vue-router'

export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: () => import('../views/HomeView.vue') },
      { path: '/:pathMatch(.*)*', component: { template: '<div style="padding:60px">404</div>' } },
    ],
  })
}
