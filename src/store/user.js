/**
 * 用户状态管理 (Pinia)
 * 包含 token / user info / favorites 数量
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/client.js'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const favCount = ref(0)
  const cartCount = ref(0)

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

  async function login(email, password) {
    const res = await api.auth.login({ email, password })
    setAuth(res.data.token, res.data.user)
    return res.data
  }

  async function register(payload) {
    const res = await api.auth.register(payload)
    setAuth(res.data.token, res.data.user)
    return res.data
  }

  async function fetchMe() {
    if (!token.value) return null
    try {
      const res = await api.auth.me()
      user.value = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    } catch (e) {
      logout()
      return null
    }
  }

  function logout() {
    setAuth('', null)
  }

  async function refreshFavCount() {
    if (!token.value) return
    try {
      const res = await api.favorites.list()
      favCount.value = res.data.length
    } catch (e) { /* ignore */ }
  }

  return {
    token, user, favCount, cartCount,
    isLoggedIn, isAdmin, preferredLanguage,
    setAuth, login, register, fetchMe, logout, refreshFavCount
  }
})
