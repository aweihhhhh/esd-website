<template>
  <div class="container-x py-10 max-w-md">
    <Breadcrumb :items="[{ text: t('common.home'), to: '/' }, { text: t('auth.loginTitle') }]" />
    <div class="card p-8 mt-4">
      <h1 class="text-2xl font-bold text-brand-500 mb-1">{{ t('auth.loginTitle') }}</h1>
      <p class="text-sm text-gray-500 mb-6">{{ t('auth.welcome', { name: '' }).replace(',', '') }}</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.email') }}</label>
          <input v-model="form.email" type="email" required autocomplete="email"
                 class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.password') }}</label>
          <input v-model="form.password" type="password" required autocomplete="current-password"
                 class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
        </div>
        <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full !py-2.5">
          {{ loading ? t('common.loading') : t('auth.loginBtn') }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        {{ t('auth.noAccount') }}
        <router-link to="/register" class="text-accent hover:underline">{{ t('auth.registerBtn') }}</router-link>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-400">
        <p>Demo accounts (dev only):</p>
        <p>👤 demo@esd-diode.com / Demo@123456</p>
        <p>👑 admin@esd-diode.com / Admin@123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useUserStore } from '@/store/user.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await userStore.login(form.email, form.password)
    ElMessage.success(t('auth.success'))
    const redirect = route.query.redirect || '/account'
    router.push(redirect)
  } catch (e) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
