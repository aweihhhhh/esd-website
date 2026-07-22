/**
 * 用户状态管理 (Pinia)
 * 包含 token / user info / favorites 数量
 * 智能降级: 后端不可用时, 自动用 localStorage 模拟
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/client.js'

// 简易本地账户库 (开发/演示模式, 无后端时使用)
const LOCAL_USERS_KEY = 'local_users_v1'
const LOCAL_SESSION_KEY = 'local_session_v1'

function loadLocalUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]') } catch { return [] }
}
function saveLocalUsers(list) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list))
}

// 简易 hash (仅用于演示, 非生产加密)
function pseudoHash(pwd) {
  let h = 0
  for (let i = 0; i < pwd.length; i++) h = ((h << 5) - h + pwd.charCodeAt(i)) | 0
  return 'h_' + Math.abs(h).toString(36) + '_' + pwd.length
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const favCount = ref(0)
  const cartCount = ref(0)
  // 后端模式 vs 本地模式
  const backendAvailable = ref(true)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => ['staff', 'admin'].includes(user.value?.role))
  const preferredLanguage = computed(() => user.value?.preferredLanguage || 'en')

  function setAuth(t, u) {
    token.value = t
    user.value = u
    if (t) {
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  /**
   * 注册 (带后端/本地自动降级)
   */
  async function register(payload) {
    if (backendAvailable.value) {
      try {
        const res = await api.auth.register(payload)
        setAuth(res.data.token, res.data.user)
        return res.data
      } catch (e) {
        if (isNetworkError(e)) {
          backendAvailable.value = false
          console.warn('[Auth] Backend unavailable, switching to local mode')
        } else {
          throw e
        }
      }
    }
    // 本地模式
    return registerLocal(payload)
  }

  function registerLocal({ email, password, fullName, company, phone, preferredLanguage, preferredCurrency }) {
    const users = loadLocalUsers()
    if (users.find(u => u.email === email)) {
      throw { code: 409, message: '该邮箱已注册 / Email already registered' }
    }
    const newUser = {
      id: Date.now(),
      email,
      passwordHash: pseudoHash(password),
      fullName,
      phone: phone || null,
      role: 'customer',
      companyId: null,
      preferredLanguage: preferredLanguage || 'en',
      preferredCurrency: preferredCurrency || 'USD',
      status: 'active',
      createdAt: new Date().toISOString(),
      company: company ? { name: company.name, country: company.country } : null
    }
    users.push(newUser)
    saveLocalUsers(users)
    // 自动创建演示企业
    const tokenValue = 'local_' + btoa(email + ':' + Date.now()).slice(0, 40)
    setAuth(tokenValue, newUser)
    return { token: tokenValue, user: newUser, mode: 'local' }
  }

  /**
   * 登录 (带后端/本地自动降级)
   */
  async function login(email, password) {
    if (backendAvailable.value) {
      try {
        const res = await api.auth.login({ email, password })
        setAuth(res.data.token, res.data.user)
        return res.data
      } catch (e) {
        if (isNetworkError(e)) {
          backendAvailable.value = false
          console.warn('[Auth] Backend unavailable, switching to local mode')
        } else {
          throw e
        }
      }
    }
    return loginLocal(email, password)
  }

  function loginLocal(email, password) {
    const users = loadLocalUsers()
    const found = users.find(u => u.email === email && u.passwordHash === pseudoHash(password))
    if (!found) {
      // 演示账号 fallback
      if (email === 'demo@esd-diode.com' && password === 'Demo@123456') {
        const demo = { id: 1, email, fullName: 'Demo Buyer', role: 'customer',
          preferredLanguage: 'en', preferredCurrency: 'USD', status: 'active', createdAt: new Date().toISOString() }
        const tokenValue = 'local_demo_token'
        setAuth(tokenValue, demo)
        return { token: tokenValue, user: demo, mode: 'local' }
      }
      if (email === 'admin@esd-diode.com' && password === 'Admin@123456') {
        const adm = { id: 2, email, fullName: 'Site Admin', role: 'admin',
          preferredLanguage: 'en', preferredCurrency: 'USD', status: 'active', createdAt: new Date().toISOString() }
        const tokenValue = 'local_admin_token'
        setAuth(tokenValue, adm)
        return { token: tokenValue, user: adm, mode: 'local' }
      }
      throw { code: 401, message: '邮箱或密码错误 / Invalid email or password' }
    }
    const tokenValue = 'local_' + btoa(email + ':' + Date.now()).slice(0, 40)
    setAuth(tokenValue, found)
    return { token: tokenValue, user: found, mode: 'local' }
  }

  function isNetworkError(e) {
    return e?.code === 'ERR_NETWORK' || e?.code === 'ECONNREFUSED' || e?.message?.includes('Network Error') || !e?.code
  }

  async function fetchMe() {
    if (!token.value) return null
    if (backendAvailable.value && !token.value.startsWith('local_')) {
      try {
        const res = await api.auth.me()
        user.value = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      } catch (e) {
        if (isNetworkError(e)) backendAvailable.value = false
        else logout()
        return user.value
      }
    }
    return user.value
  }

  function logout() {
    setAuth('', null)
  }

  async function refreshFavCount() {
    // 演示模式: 从 localStorage 读
    try {
      const list = JSON.parse(localStorage.getItem('favorites') || '[]')
      favCount.value = list.length
    } catch { favCount.value = 0 }
  }

  return {
    token, user, favCount, cartCount, backendAvailable,
    isLoggedIn, isAdmin, preferredLanguage,
    setAuth, login, register, fetchMe, logout, refreshFavCount
  }
})
