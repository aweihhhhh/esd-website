/**
 * Axios HTTP 客户端
 * 统一 baseURL / token 注入 / 错误处理
 */
import axios from 'axios'

// 后端 API 地址 - 通过环境变量配置
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api/v1'
const API_PREFIX = '/api/v1'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截: 注入 token + 国际化
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // 携带语言
  const lang = localStorage.getItem('locale') || 'en'
  config.params = { ...config.params, lang }
  return config
})

// 响应拦截: 统一处理业务错误
client.interceptors.response.use(
  res => res.data,
  err => {
    const status = err.response?.status
    const data = err.response?.data
    // 401: token 失效, 跳登录
    if (status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login'
      }
    }
    // 业务错误抛到 catch
    return Promise.reject(data || { code: -1, message: err.message })
  }
)

export default client

// ============== 业务 API 封装 ==============
export const api = {
  // 认证
  auth: {
    login: (data) => client.post('/auth/login', data),
    register: (data) => client.post('/auth/register', data),
    me: () => client.get('/auth/me'),
    logout: () => client.post('/auth/logout')
  },
  // 产品
  products: {
    list: (params) => client.get('/products', { params }),
    detail: (slug, lang) => client.get(`/products/${slug}`, { params: { lang } }),
    featured: (lang) => client.get('/products/featured', { params: { lang } }),
    filters: (lang) => client.get('/products/filters', { params: { lang } }),
    related: (id, lang) => client.get(`/products/${id}/related`, { params: { lang } })
  },
  // 分类
  categories: {
    list: (lang) => client.get('/categories', { params: { lang } })
  },
  // 询价
  inquiries: {
    submit: (formData) => client.post('/inquiries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    my: (params) => client.get('/inquiries/my', { params }),
    detail: (id) => client.get(`/inquiries/${id}`),
    sendMessage: (id, content) => client.post(`/inquiries/${id}/messages`, { content })
  },
  // 用户
  users: {
    updateMe: (data) => client.patch('/users/me', data),
    changePassword: (data) => client.post('/users/me/change-password', data),
    addresses: () => client.get('/users/me/addresses'),
    addAddress: (data) => client.post('/users/me/addresses', data),
    deleteAddress: (id) => client.delete(`/users/me/addresses/${id}`)
  },
  // 订单
  orders: {
    my: (params) => client.get('/orders/my', { params }),
    detail: (id) => client.get(`/orders/${id}`)
  },
  // 收藏
  favorites: {
    list: () => client.get('/favorites'),
    add: (productId) => client.post(`/favorites/${productId}`),
    remove: (productId) => client.delete(`/favorites/${productId}`)
  },
  // 评价
  reviews: {
    list: (productId, params) => client.get('/reviews', { params: { productId, ...params } }),
    submit: (data) => client.post('/reviews', data)
  },
  // 后台 (需要 staff/admin 角色)
  admin: {
    stats: () => client.get('/admin/stats'),
    inquiries: (params) => client.get('/admin/inquiries', { params }),
    updateInquiry: (id, data) => client.patch(`/admin/inquiries/${id}/status`, data),
    users: (params) => client.get('/admin/users', { params })
  },
  // 国际化文案
  i18n: {
    get: (lang) => client.get(`/i18n/${lang}`)
  }
}
