<template>
  <div class="container-x py-10 max-w-md">
    <Breadcrumb :items="[{ text: t('common.home'), to: '/' }, { text: t('auth.registerTitle') }]" />
    <div class="card p-8 mt-4">
      <h1 class="text-2xl font-bold text-brand-500 mb-1">{{ t('auth.registerTitle') }}</h1>
      <p class="text-sm text-gray-500 mb-6">B2B Wholesale Account</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.fullName') }}</label>
            <input v-model="form.fullName" required
                   class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.company') }}</label>
            <input v-model="form.companyName"
                   class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 outline-none" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.email') }}</label>
          <input v-model="form.email" type="email" required autocomplete="email"
                 class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.password') }}</label>
          <input v-model="form.password" type="password" required minlength="8" autocomplete="new-password"
                 class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 outline-none" />
          <p class="text-xs text-gray-400 mt-1">Min 8 characters</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.country') }}</label>
          <select v-model="form.country" class="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option value="CN">🇨🇳 China</option>
            <option value="US">🇺🇸 United States</option>
            <option value="BR">🇧🇷 Brazil</option>
            <option value="RU">🇷🇺 Russia</option>
            <option value="DE">🇩🇪 Germany</option>
            <option value="IN">🇮🇳 India</option>
            <option value="JP">🇯🇵 Japan</option>
            <option value="KR">🇰🇷 South Korea</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="FR">🇫🇷 France</option>
            <option value="other">🌍 Other</option>
          </select>
        </div>
        <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full !py-2.5">
          {{ loading ? t('common.loading') : t('auth.registerBtn') }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        {{ t('auth.haveAccount') }}
        <router-link to="/login" class="text-accent hover:underline">{{ t('auth.loginBtn') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useUserStore } from '@/store/user.js'
import { setLocale } from '@/locales'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const form = reactive({ fullName: '', companyName: '', email: '', password: '', country: 'CN' })
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    const payload = {
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      company: form.companyName ? { name: form.companyName, country: form.country } : null,
      preferredLanguage: localStorage.getItem('locale') || 'en'
    }
    await userStore.register(payload)
    ElMessage.success(t('auth.success'))
    // 同步用户语言偏好
    if (userStore.user?.preferredLanguage) setLocale(userStore.user.preferredLanguage)
    router.push('/account')
  } catch (e) {
    error.value = e.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
