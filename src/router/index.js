import { createRouter, createWebHashHistory } from 'vue-router'
import { i18n } from '@/locales'

/**
 * Router
 * 使用 hash 模式以便静态托管 (Netlify / Vercel / Nginx)
 * 不需要服务端 rewrite 规则
 */
const routes = [
  { path: '/',              name: 'home',        component: () => import('@/views/HomeView.vue'),
    meta: { titleKey: 'meta.title' } },
  { path: '/products',     name: 'products',    component: () => import('@/views/ProductsView.vue'),
    meta: { titleKey: 'products.title' } },
  { path: '/products/:id', name: 'product',     component: () => import('@/views/ProductDetailView.vue'),
    meta: { titleKey: 'meta.title' } },
  { path: '/inquiry',      name: 'inquiry',     component: () => import('@/views/InquiryView.vue'),
    meta: { titleKey: 'inquiry.title' } },
  { path: '/catalog',      name: 'catalog',     component: () => import('@/views/CatalogView.vue'),
    meta: { titleKey: 'catalog.title' } },
  { path: '/about',        name: 'about',       component: () => import('@/views/AboutView.vue'),
    meta: { titleKey: 'about.title' } },
  { path: '/contact',      name: 'contact',     component: () => import('@/views/ContactView.vue'),
    meta: { titleKey: 'contact.title' } },
  // === 新增页面 (i18n + 后端对接) ===
  { path: '/login',        name: 'login',       component: () => import('@/views/LoginView.vue'),
    meta: { titleKey: 'auth.loginTitle' } },
  { path: '/register',     name: 'register',    component: () => import('@/views/RegisterView.vue'),
    meta: { titleKey: 'auth.registerTitle' } },
  { path: '/account',      name: 'account',     component: () => import('@/views/AccountView.vue'),
    meta: { titleKey: 'nav.account', requiresAuth: true } },
  { path: '/admin',        name: 'admin',       component: () => import('@/views/AdminView.vue'),
    meta: { titleKey: 'Admin', requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'),
    meta: { titleKey: 'common.error' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0, behavior: 'smooth' }
  }
})

// SEO + 权限守卫
router.afterEach((to) => {
  if (to.meta?.titleKey) {
    document.title = i18n.global.t(to.meta.titleKey) + ' | ESD Diode Wholesale'
  }
})

router.beforeEach((to, _from, next) => {
  // 权限检查
  if (to.meta?.requiresAuth || to.meta?.requiresAdmin) {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const token = localStorage.getItem('token')
    if (!token || !user) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
    if (to.meta.requiresAdmin && !['staff', 'admin'].includes(user.role)) {
      return next({ path: '/' })
    }
  }
  next()
})

export default router
