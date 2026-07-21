import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * Router
 * 使用 hash 模式以便静态托管 (Netlify / Vercel / Nginx)
 * 不需要服务端 rewrite 规则
 */
const routes = [
  { path: '/',              name: 'home',        component: () => import('@/views/HomeView.vue'),
    meta: { title: 'ESD Protection Diode Wholesale | TVS Array Supplier' } },
  { path: '/products',     name: 'products',    component: () => import('@/views/ProductsView.vue'),
    meta: { title: 'All ESD Products | TVS Diode Catalog' } },
  { path: '/products/:id', name: 'product',     component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Product Detail' } },
  { path: '/inquiry',      name: 'inquiry',     component: () => import('@/views/InquiryView.vue'),
    meta: { title: 'Send Inquiry | Get Quote' } },
  { path: '/catalog',      name: 'catalog',     component: () => import('@/views/CatalogView.vue'),
    meta: { title: 'Download Product Catalog PDF' } },
  { path: '/about',        name: 'about',       component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About Us | ESD Diode Factory' } },
  { path: '/contact',      name: 'contact',     component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contact Us' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 Not Found' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0, behavior: 'smooth' }
  }
})

// SEO: update document.title on route change
router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
