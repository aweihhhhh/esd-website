import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import './assets/main.css'

// 全局错误捕获 - 把 JS 错误显示到页面上, 避免白屏看不到原因
window.addEventListener('error', (e) => {
  const root = document.getElementById('app')
  if (root && !root.dataset.errored) {
    root.dataset.errored = '1'
    root.innerHTML = `
      <div style="padding:24px;font-family:monospace;color:#b91c1c;background:#fef2f2;border:2px solid #ef4444;margin:24px;border-radius:8px;">
        <h2 style="margin:0 0 12px 0;color:#dc2626;">⚠️ JS Runtime Error</h2>
        <pre style="white-space:pre-wrap;margin:0;font-size:13px;">${(e.error?.stack || e.message || String(e)).replace(/</g, '&lt;')}</pre>
      </div>
    `
  }
})
window.addEventListener('unhandledrejection', (e) => {
  const root = document.getElementById('app')
  if (root && !root.dataset.errored) {
    root.dataset.errored = '1'
    root.innerHTML = `
      <div style="padding:24px;font-family:monospace;color:#b91c1c;background:#fef2f2;border:2px solid #ef4444;margin:24px;border-radius:8px;">
        <h2 style="margin:0 0 12px 0;color:#dc2626;">⚠️ Unhandled Promise Rejection</h2>
        <pre style="white-space:pre-wrap;margin:0;font-size:13px;">${(e.reason?.stack || e.reason?.message || String(e.reason)).replace(/</g, '&lt;')}</pre>
      </div>
    `
  }
})

// 必须先加载 - 这会为 221 款产品自动生成 5 张 SVG 图片并挂到 product.images
import('./data/productImages.js').catch(err => {
  console.error('Failed to load productImages:', err)
  const root = document.getElementById('app')
  if (root) {
    root.innerHTML = `
      <div style="padding:24px;font-family:monospace;color:#b91c1c;background:#fef2f2;border:2px solid #ef4444;margin:24px;border-radius:8px;">
        <h2>Failed to load product images</h2>
        <pre>${(err.stack || err.message).replace(/</g, '&lt;')}</pre>
      </div>
    `
  }
})

// Create Vue application instance
const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err, info)
  const root = document.getElementById('app')
  if (root) {
    root.innerHTML += `
      <div style="padding:16px;font-family:monospace;color:#b91c1c;background:#fef2f2;border:2px solid #ef4444;margin:24px;border-radius:8px;">
        <h3>Vue Error (${info})</h3>
        <pre>${(err.stack || err.message).replace(/</g, '&lt;')}</pre>
      </div>
    `
  }
}
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
