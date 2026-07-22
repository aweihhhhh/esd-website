<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.breadcrumbHome'), to: '/' }, { text: t('products.title') }]" />

    <div class="mt-4 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-brand-500">{{ t('products.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ t('products.showing', { count: filtered.length, total: products.length }) }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <div class="relative flex-1 sm:w-80">
          <input v-model="search" type="text" :placeholder="t('products.search')"
                 class="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
          <svg class="absolute left-2.5 top-3 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <select v-model="sort" class="px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white">
          <option value="default">{{ t('products.sortDefault') }}</option>
          <option value="new">{{ t('products.sortNew') }}</option>
          <option value="cap-asc">{{ t('products.sortCapAsc') }}</option>
          <option value="cap-desc">{{ t('products.sortCapDesc') }}</option>
          <option value="ippm-desc">{{ t('products.sortIppmDesc') }}</option>
        </select>
        <button @click="mobileFilter = !mobileFilter" class="md:hidden btn-outline !py-2 !px-3 !text-xs">⚙ {{ t('products.filter') }}</button>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside :class="['bg-white border border-gray-200 rounded-lg p-4 self-start sticky top-32',
                      mobileFilter ? 'block' : 'hidden md:block']">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-brand-500">{{ t('products.filter') }}</h3>
          <button v-if="hasFilter" @click="resetFilter" class="text-xs text-accent hover:underline">{{ t('products.reset') }}</button>
        </div>

        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('products.package') }}</h4>
          <div class="space-y-1 max-h-56 overflow-auto pr-1">
            <label v-for="p in packageOptions" :key="p" class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" :value="p" v-model="filterPkg" class="accent-brand-500" />
              <span class="truncate">{{ p }}</span>
              <span class="ml-auto text-xs text-gray-400">{{ countByPackage(p) }}</span>
            </label>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('products.direction') }}</h4>
          <div class="space-y-1">
            <label class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" value="Unidirectional" v-model="filterDir" class="accent-brand-500" />
              <span>{{ t('products.directionUni') }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" value="Bidirectional" v-model="filterDir" class="accent-brand-500" />
              <span>{{ t('products.directionBi') }}</span>
            </label>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('products.voltage') }}</h4>
          <div class="space-y-1">
            <label v-for="(b, i) in voltageBuckets" :key="i" class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" :value="i" v-model="filterVolt" class="accent-brand-500" />
              <span>{{ b.label }}</span>
            </label>
          </div>
        </div>

        <div class="mb-3">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('products.features') }}</h4>
          <div class="space-y-1">
            <label class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" v-model="lowCap"  class="accent-brand-500" />
              <span>{{ t('products.lowCap') }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" v-model="highSurge" class="accent-brand-500" />
              <span>{{ t('products.highSurge') }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-500">
              <input type="checkbox" v-model="isArray"  class="accent-brand-500" />
              <span>{{ t('products.array') }}</span>
            </label>
          </div>
        </div>
      </aside>

      <section>
        <transition name="fade">
          <div v-if="selectedSet.size > 0"
               class="sticky top-28 z-20 mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-brand-500 text-white shadow-md">
            <div class="text-sm font-medium">
              ✓ {{ t('products.bulkActions', { count: selectedSet.size, plural: selectedSet.size > 1 ? 's' : '' }) }}
            </div>
            <div class="flex items-center gap-2">
              <button @click="exportSelected" class="btn !py-1.5 !px-3 !text-xs bg-white text-brand-500 hover:bg-gray-100">📊 {{ t('products.exportCSV') }}</button>
              <router-link :to="{ path: '/inquiry', query: { models: selectedModels.join(',') } }"
                           class="btn-accent !py-1.5 !px-3 !text-xs">📩 {{ t('products.bulkInquiry') }}</router-link>
              <button @click="selectedSet.clear()" class="btn !py-1.5 !px-3 !text-xs bg-white/20 hover:bg-white/30">✕ {{ t('products.clear') }}</button>
            </div>
          </div>
        </transition>

        <div v-if="paged.length" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductCard v-for="p in paged" :key="p.id" :product="p"
                       :selectable="true" :selected="selectedSet.has(p.id)"
                       @toggle="toggleSelect" />
        </div>
        <div v-else class="card p-10 text-center text-gray-500">
          <div class="text-4xl mb-2">🔍</div>
          <div class="font-medium">{{ t('products.noResults') }}</div>
          <button @click="resetFilter" class="mt-3 text-accent text-sm hover:underline">{{ t('products.reset') }}</button>
        </div>

        <div v-if="filtered.length" class="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <button @click="cur = Math.max(1, cur - 1)" :disabled="cur === 1"
                  class="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">‹ {{ t('common.prev') }}</button>
          <button v-for="page in totalPages" :key="page" @click="cur = page"
                  :class="['px-3 py-1.5 border rounded text-sm',
                           cur === page ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 hover:bg-gray-50']">
            {{ page }}
          </button>
          <button @click="cur = Math.min(totalPages, cur + 1)" :disabled="cur === totalPages"
                  class="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">{{ t('common.next') }} ›</button>
          <span class="ml-3 text-xs text-gray-500">{{ t('products.perPage', { cur, total: totalPages }) }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductCard from '@/components/ProductCard.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import {
  products, packageOptions, directionOptions, voltageBuckets
} from '@/data/products.js'

const { t } = useI18n()
const route = useRoute()

const search    = ref('')
const sort      = ref('default')
const filterPkg = ref([])
const filterDir = ref([])
const filterVolt= ref([])
const lowCap    = ref(false)
const highSurge = ref(false)
const isArray   = ref(false)
const mobileFilter = ref(false)

const selectedSet = ref(new Set())
const toggleSelect = (id) => {
  if (selectedSet.value.has(id)) selectedSet.value.delete(id)
  else selectedSet.value.add(id)
  selectedSet.value = new Set(selectedSet.value)
}
const selectedModels = computed(() => products.filter(p => selectedSet.value.has(p.id)).map(p => p.model))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return products.filter(p => {
    if (q && !`${p.model} ${p.vrwm} ${p.package} ${p.direction}`.toLowerCase().includes(q)) return false
    if (filterPkg.value.length && !filterPkg.value.includes(p.package)) return false
    if (filterDir.value.length && !filterDir.value.includes(p.direction)) return false
    if (filterVolt.value.length) {
      const inBucket = filterVolt.value.some(idx => {
        const b = voltageBuckets[idx]
        return p.vrwmMin <= b.max && p.vrwmMax >= b.min
      })
      if (!inBucket) return false
    }
    if (lowCap.value    && p.cjValue   > 1)  return false
    if (highSurge.value && p.ippmValue < 15) return false
    if (isArray.value   && !p.tags?.includes('array')) return false
    return true
  })
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  switch (sort.value) {
    case 'cap-asc':   arr.sort((a, b) => a.cjValue   - b.cjValue);   break
    case 'cap-desc':  arr.sort((a, b) => b.cjValue   - a.cjValue);   break
    case 'ippm-desc': arr.sort((a, b) => b.ippmValue - a.ippmValue); break
    case 'new':       arr.sort((a, b) => a.model.localeCompare(b.model))
  }
  return arr
})

const PAGE_SIZE = 24
const cur = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / PAGE_SIZE)))
const paged = computed(() => sorted.value.slice((cur.value - 1) * PAGE_SIZE, cur.value * PAGE_SIZE))
watch([filtered, sort], () => { cur.value = 1 })

const countByPackage = (pkg) => products.filter(p => p.package === pkg).length
const hasFilter = computed(() =>
  search.value || filterPkg.value.length || filterDir.value.length || filterVolt.value.length
  || lowCap.value || highSurge.value || isArray.value
)
const resetFilter = () => {
  search.value = ''; sort.value = 'default'
  filterPkg.value = []; filterDir.value = []; filterVolt.value = []
  lowCap.value = false; highSurge.value = false; isArray.value = false
}

const exportSelected = () => {
  const list = products.filter(p => selectedSet.value.has(p.id))
  if (!list.length) return
  const headers = ['Model', 'Package', 'Direction', 'VRWM', 'CJ(TYP)', 'IPPM', 'Package Qty']
  const rows = list.map(p => [p.model, p.package, p.direction, p.vrwm, p.cj, p.ippm, p.packageQty])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ESD-Specs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  const q = route.query
  if (q.pkg)    filterPkg.value = [String(q.pkg)]
  if (q.q)      search.value = String(q.q)
  if (q.lowCap === '1')  lowCap.value    = true
  if (q.highSurge === '1') highSurge.value = true
  if (q.array === '1')   isArray.value   = true
})
watch(() => route.query, (q) => {
  if (q.pkg)    filterPkg.value = [String(q.pkg)]
  if (q.q)      search.value = String(q.q)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
