<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.home'), to: '/' }, { text: 'Admin' }]" />

    <div v-if="!userStore.isAdmin" class="mt-10 card p-10 text-center">
      <div class="text-5xl">🚫</div>
      <h2 class="mt-3 text-xl font-bold text-red-600">{{ t('admin.accessDenied') }}</h2>
      <p class="text-gray-500 mt-1">{{ t('admin.accessDeniedDesc') }}</p>
    </div>

    <div v-else class="mt-4">
      <h1 class="text-2xl font-bold text-brand-500 mb-4">{{ t('admin.title') }}</h1>

      <!-- Stats cards -->
      <div class="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <div class="card p-5">
          <div class="text-xs text-gray-500">{{ t('admin.statsUsers') }}</div>
          <div class="text-2xl font-bold text-brand-500">{{ stats.counts?.users || 0 }}</div>
        </div>
        <div class="card p-5">
          <div class="text-xs text-gray-500">{{ t('admin.statsInquiries') }}</div>
          <div class="text-2xl font-bold text-brand-500">{{ stats.counts?.inquiries || 0 }}</div>
        </div>
        <div class="card p-5">
          <div class="text-xs text-gray-500">{{ t('admin.statsProducts') }}</div>
          <div class="text-2xl font-bold text-brand-500">{{ stats.counts?.products || 0 }}</div>
        </div>
        <div class="card p-5">
          <div class="text-xs text-gray-500">{{ t('admin.statsRevenue') }}</div>
          <div class="text-2xl font-bold text-green-600">${{ stats.revenue?.total?.toFixed(2) || '0.00' }}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-4 border-b border-gray-200">
        <button v-for="tab in adminTabs" :key="tab.key" @click="active = tab.key"
                :class="['px-4 py-2 text-sm font-medium border-b-2 -mb-px',
                         active === tab.key ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700']">
          {{ tab.label }}
        </button>
      </div>

      <!-- Inquiries table -->
      <div v-if="active === 'inquiries'" class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th class="px-3 py-2">{{ t('admin.thNo') }}</th>
              <th class="px-3 py-2">{{ t('admin.thCompany') }}</th>
              <th class="px-3 py-2">{{ t('admin.thContact') }}</th>
              <th class="px-3 py-2">{{ t('admin.thQty') }}</th>
              <th class="px-3 py-2">{{ t('admin.thStatus') }}</th>
              <th class="px-3 py-2">{{ t('admin.thDate') }}</th>
              <th class="px-3 py-2">{{ t('admin.thActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in inquiries" :key="i.id" class="border-t border-gray-100">
              <td class="px-3 py-2 font-mono text-xs">{{ i.inquiryNo }}</td>
              <td class="px-3 py-2">{{ i.companyName }}</td>
              <td class="px-3 py-2 text-xs">{{ i.contactName }}<br>{{ i.contactEmail }}</td>
              <td class="px-3 py-2">{{ i.totalQty }}</td>
              <td class="px-3 py-2">
                <select :value="i.status" @change="updateStatus(i.id, $event.target.value)"
                        class="text-xs px-2 py-1 border border-gray-300 rounded bg-white">
                  <option value="new">new</option>
                  <option value="processing">processing</option>
                  <option value="quoted">quoted</option>
                  <option value="won">won</option>
                  <option value="lost">lost</option>
                  <option value="closed">closed</option>
                </select>
              </td>
              <td class="px-3 py-2 text-xs text-gray-500">{{ new Date(i.createdAt).toLocaleDateString() }}</td>
              <td class="px-3 py-2">
                <button class="text-xs text-accent hover:underline">{{ t('admin.view') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Users table -->
      <div v-else class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th class="px-3 py-2">{{ t('admin.thEmail') }}</th>
              <th class="px-3 py-2">{{ t('admin.thName') }}</th>
              <th class="px-3 py-2">{{ t('admin.thCompany') }}</th>
              <th class="px-3 py-2">{{ t('admin.thRole') }}</th>
              <th class="px-3 py-2">{{ t('admin.thLang') }}</th>
              <th class="px-3 py-2">{{ t('admin.thJoined') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id" class="border-t border-gray-100">
              <td class="px-3 py-2 text-xs">{{ u.email }}</td>
              <td class="px-3 py-2">{{ u.fullName }}</td>
              <td class="px-3 py-2 text-xs">{{ u.company?.name || '-' }}</td>
              <td class="px-3 py-2"><span class="pill pill-blue">{{ u.role }}</span></td>
              <td class="px-3 py-2 text-xs">{{ u.preferredLanguage }}</td>
              <td class="px-3 py-2 text-xs text-gray-500">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useUserStore } from '@/store/user.js'
import { api } from '@/api/client.js'

const { t } = useI18n()
const adminTabs = computed(() => [
  { key: 'inquiries', label: t('admin.tabsInquiries') },
  { key: 'users',     label: t('admin.tabsUsers') }
])
const userStore = useUserStore()
const active = ref('inquiries')
const stats = ref({})
const inquiries = ref([])
const users = ref([])

async function loadStats() {
  try {
    const r = await api.admin.stats()
    stats.value = r.data
  } catch (e) { console.error(e) }
}

async function loadInquiries() {
  try {
    const r = await api.admin.inquiries({ pageSize: 100 })
    inquiries.value = r.data?.list || []
  } catch (e) { console.error(e) }
}

async function loadUsers() {
  try {
    const r = await api.admin.users({ pageSize: 100 })
    users.value = r.data?.list || []
  } catch (e) { console.error(e) }
}

async function updateStatus(id, status) {
  try {
    await api.admin.updateInquiry(id, { status })
    ElMessage.success('Status updated')
  } catch (e) {
    ElMessage.error(e.message || 'Failed')
  }
}

onMounted(() => {
  loadStats()
  loadInquiries()
  loadUsers()
})
</script>
