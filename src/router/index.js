import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { performanceMonitor } from '@/performance'
import { useUserStore } from '@/stores/modules/user'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 #
// 2. hash模式：   createWebHashHistory 地址栏带 #
// 3. memory模式： createMemoryHistory  用于服务器端渲染
// console.log(import.meta.env.DEV)

// vite 中的环境变量 import.meta.env.BASE_URL  就是 vite.config.js 中的 base 配置项
const router = createRouter({
  history: import.meta.env.SSR
    ? createMemoryHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/hometab',
      children: [
        {
          path: '/hometab',
          component: () => import('@/views/layout/HomeTab.vue')
        },
        {
          path: '/footprint',
          component: () => import('@/views/layout/FootPrintTab.vue')
        },
        {
          path: '/plan',
          component: () => import('@/views/layout/PlanTab.vue')
        },
        {
          path: '/mine',
          component: () => import('@/views/layout/MineTab.vue')
        },
        {
          path: '/store-detail/:storeid',
          name: 'StoreDetail',
          component: () => import('@/views/home/StoreDetail.vue')
        },
        {
          path: '/admin',
          name: 'Admin',
          component: () => import('@/views/admin/StoreList.vue')
        },
        {
          path: '/admin-manager',
          name: 'AdminManager',
          component: () => import('@/views/admin/AdminManager.vue')
        },
        {
          path: '/admin-edit',
          name: 'AdminEdit',
          component: () => import('@/views/admin/AdminEdit.vue')
        }
      ]
    }
  ]
})

// 页面性能监控导航守卫
// 只在初始加载时监控性能，路由切换时不监控
let isInitialLoad = true

// 合并后的导航守卫
router.beforeEach((to, from, next) => {
  // 1. 处理路径大小写
  const lowerPath = to.path.toLowerCase()
  if (to.path !== lowerPath) {
    next({ path: lowerPath, query: to.query, hash: to.hash })
    return
  }

  // 2. 页面性能监控
  if (isInitialLoad) {
    const pageName = to.name || to.path.replace(/\//g, '-').slice(1) || 'index'
    performanceMonitor.startPageMonitor(pageName)
  }

  next()
})

// 页面加载完成后结束监控
router.afterEach((to) => {
  if (isInitialLoad) {
    // 获取页面名称
    const pageName = to.name || to.path.replace(/\//g, '-').slice(1) || 'index'

    // 等待页面完全加载
    setTimeout(() => {
      performanceMonitor.endPageMonitor(pageName)
      // 标记初始加载已完成
      isInitialLoad = false
    }, 2000) // 给页面一点时间完成渲染
  }
})

// 登录访问拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  // 检查是否访问管理员相关路由
  if (
    (to.path === '/admin' || to.path === '/admin-manager') &&
    !userStore.isAdmin
  ) {
    return '/mine'
  }
})

export default router
