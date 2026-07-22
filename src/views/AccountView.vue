<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.home'), to: '/' }, { text: t('nav.account') }]" />

    <div v-if="!userStore.isLoggedIn" class="mt-10 card p-10 text-center">
      <div class="text-5xl">🔒</div>
      <h2 class="mt-3 text-xl font-bold text-brand-500">Please sign in</h2>
      <p class="text-gray-500 mt-1">You need to login to view your account.</p>
      <router-link to="/login" class="mt-4 inline-block btn-primary">Sign In</router-link>
    </div>

    <div v-else class="mt-4 grid gap-6 md:grid-cols-[240px_1fr]">
      <!-- Sidebar -->
      <aside class="card p-4 self-start">
        <div class="text-center pb-4 mb-3 border-b border-gray-200">
          <div class="w-16 h-16 rounded-full bg-brand-50 text-brand-500 grid place-items-center mx-auto text-2xl font-bold">
            {{ userStore.user?.fullName?.[0] || 'U' }}
          </div>
          <div class="mt-2 font-semibold text-sm">{{ userStore.user?.fullName }}</div>
          <div class="text-xs text-gray-500">{{ userStore.user?.email }}</div>
          <div v-if="userStore.user?.company" class="text-xs text-gray-500 mt-1">
            🏢 {{ userStore.user.company.name }}
          </div>
        </div>
        <nav class="space-y-1">
          <a v-for="t in tabs" :key="t.key" @click.prevent="active = t.key" href="#"
             :class="['block px-3 py-2 rounded text-sm cursor-pointer',
                      active === t.key ? 'bg-brand-50 text-brand-500 font-medium' : 'text-gray-700 hover:bg-gray-50']">
            {{ t.label }}
          </a>
          <a @click.prevent="handleLogout" href="#" class="block px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 cursor-pointer">
            {{ t('nav.logout') }}
          </a>
        </nav>
      </aside>

      <!-- Main -->
      <section>
        <!-- Dashboard -->
        <div v-if="active === 'dashboard'">
          <h1 class="text-2xl font-bold text-brand-500 mb-4">{{ t('nav.account') }}</h1>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div class="card p-5">
              <div class="text-xs text-gray-500">Inquiries</div>
              <div class="text-2xl font-bold text-brand-500 mt-1">{{ inquiries.length }}</div>
            </div>
            <div class="card p-5">
              <div class="text-xs text-gray-500">Orders</div>
              <div class="text-2xl font-bold text-brand-500 mt-1">{{ orders.length }}</div>
            </div>
            <div class="card p-5">
              <div class="text-xs text-gray-500">Favorites</div>
              <div class="text-2xl font-bold text-brand-500 mt-1">{{ favorites.length }}</div>
            </div>
          </div>
          <div class="mt-6 card p-5">
            <h3 class="font-semibold text-brand-500 mb-2">Profile</h3>
            <dl class="text-sm grid grid-cols-2 gap-2">
              <div><dt class="text-gray-500">Name</dt><dd>{{ userStore.user?.fullName }}</dd></div>
              <div><dt class="text-gray-500">Email</dt><dd>{{ userStore.user?.email }}</dd></div>
              <div><dt class="text-gray-500">Phone</dt><dd>{{ userStore.user?.phone || '-' }}</dd></div>
              <div><dt class="text-gray-500">Role</dt><dd>{{ userStore.user?.role }}</dd></div>
            </dl>
          </div>
        </div>

        <!-- Inquiries -->
        <div v-else-if="active === 'inquiries'">
          <h2 class="text-xl font-bold text-brand-500 mb-4">My Inquiries</h2>
          <div v-if="loading" class="text-center py-8 text-gray-500">{{ t('common.loading') }}</div>
          <div v-else-if="!inquiries.length" class="card p-8 text-center text-gray-500">No inquiries yet</div>
          <table v-else class="w-full text-sm card overflow-hidden">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="px-3 py-2">Inquiry #</th>
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">Items</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in inquiries" :key="i.id" class="border-t border-gray-100">
                <td class="px-3 py-2 font-mono text-xs">{{ i.inquiryNo }}</td>
                <td class="px-3 py-2">{{ new Date(i.createdAt).toLocaleDateString() }}</td>
                <td class="px-3 py-2">{{ i.items?.length || 0 }} items / {{ i.totalQty }} pcs</td>
                <td class="px-3 py-2">
                  <span :class="['pill', statusClass(i.status)]">{{ i.status }}</span>
                </td>
                <td class="px-3 py-2"><a href="#" class="text-accent text-xs hover:underline">View</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Orders -->
        <div v-else-if="active === 'orders'">
          <h2 class="text-xl font-bold text-brand-500 mb-4">My Orders</h2>
          <div v-if="!orders.length" class="card p-8 text-center text-gray-500">No orders yet</div>
          <table v-else class="w-full text-sm card overflow-hidden">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="px-3 py-2">Order #</th>
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">Total</th>
                <th class="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id" class="border-t border-gray-100">
                <td class="px-3 py-2 font-mono text-xs">{{ o.orderNo }}</td>
                <td class="px-3 py-2">{{ new Date(o.createdAt).toLocaleDateString() }}</td>
                <td class="px-3 py-2 font-semibold">${{ o.total }}</td>
                <td class="px-3 py-2"><span class="pill pill-blue">{{ o.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Favorites -->
        <div v-else-if="active === 'favorites'">
          <h2 class="text-xl font-bold text-brand-500 mb-4">My Favorites</h2>
          <div v-if="!favorites.length" class="card p-8 text-center text-gray-500">No favorites yet</div>
          <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard v-for="p in favorites" :key="p.id" :product="p" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useUserStore } from '@/store/user.js'
import { api } from '@/api/client.js'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const active = ref('dashboard')
const inquiries = ref([])
const orders = ref([])
const favorites = ref([])
const loading = ref(false)

const tabs = computed(() => [
  { key: 'dashboard',  label: '📊 Dashboard' },
  { key: 'inquiries',  label: '📩 My Inquiries' },
  { key: 'orders',     label: '📦 My Orders' },
  { key: 'favorites',  label: '❤️ My Favorites' }
])

const statusClass = (s) => ({
  new: 'pill-blue', processing: 'pill-amber', quoted: 'pill-green',
  won: 'pill-green', lost: 'pill-amber', closed: 'pill-blue'
}[s] || 'pill-blue')

function handleLogout() {
  userStore.logout()
  ElMessage.success('Logged out')
  router.push('/')
}

async function loadData() {
  if (!userStore.isLoggedIn) return
  loading.value = true
  try {
    const [inq, ord, fav] = await Promise.all([
      api.inquiries.my({ pageSize: 50 }).catch(() => ({ data: { list: [] } })),
      api.orders.my({ pageSize: 50 }).catch(() => ({ data: { list: [] } })),
      api.favorites.list().catch(() => ({ data: [] }))
    ])
    inquiries.value = inq.data?.list || []
    orders.value    = ord.data?.list || []
    favorites.value = fav.data || []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (userStore.isLoggedIn && !userStore.user) await userStore.fetchMe()
  loadData()
})
</script>
