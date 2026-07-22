import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// 必须先加载 - 这会为 221 款产品自动生成 5 张 SVG 图片并挂到 product.images
import './data/productImages.js'

// Create Vue application instance
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
