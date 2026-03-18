import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'AI Blog System' },
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/pages/BlogDetailPage.vue'),
    meta: { title: 'Blog Post' },
  },
  {
    path: '/architecture',
    name: 'Architecture',
    component: () => import('@/pages/ArchitecturePage.vue'),
    meta: { title: 'System Architecture' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'AI Blog'} | AI Blog System`
  next()
})

export default router
