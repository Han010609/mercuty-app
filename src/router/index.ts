/**
 * Vue Router 設定
 * 包含路由定義與路由守衛
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

/**
 * 路由守衛 - 驗證登入狀態
 */
router.beforeEach((to: any, _from: any, next: any) => {
  const authStore = useAuthStore()
  
  // 需要登入的頁面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // 已登入時訪問登入頁，導向主頁
  else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})

export default router

