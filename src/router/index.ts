import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/pages/ArticlesPage.vue'),
    meta: { title: '文章' },
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/pages/BlogDetailPage.vue'),
    meta: { title: '文章详情' },
  },
  {
    path: '/architecture',
    name: 'Architecture',
    component: () => import('@/pages/ArchitecturePage.vue'),
    meta: { title: '系统架构' },
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
  document.title = `${to.meta.title || "Artorias's Blog"} | Artorias's Blog`
  next()
})

export default router
