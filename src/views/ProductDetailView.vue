<template>
  <div class="container-x py-6" v-if="product">
    <!-- Breadcrumb -->
    <Breadcrumb :items="[
      { text: 'Home', to: '/' },
      { text: 'Products', to: '/products' },
      { text: product.package, to: `/products?pkg=${encodeURIComponent(product.package)}` },
      { text: product.model }
    ]" />

    <!-- ============== Top section ============== -->
    <div class="mt-4 grid gap-6 md:grid-cols-2">
      <!-- Image gallery: 5 views (real photos preferred, SVG fallback) -->
      <div class="card p-6 flex flex-col">
        <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden relative grid place-items-center">
          <!-- 真实图片 -->
          <img v-if="product.images?.[activeImg]?.isReal"
               :src="product.images[activeImg].url"
               :alt="`${product.model} - ${t('detail.imageType.' + product.images[activeImg].type)}`"
               class="w-full h-full object-contain" />
          <!-- SVG 程序生成 -->
          <div v-else-if="product.images?.[activeImg]?.svg"
               v-html="product.images[activeImg].svg"
               class="w-full h-full [&>svg]:w-full [&>svg]:h-full"></div>
          <!-- REAL 角标 -->
          <span v-if="product.images?.[activeImg]?.isReal"
                class="absolute top-3 right-3 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded shadow">
            📷 REAL
          </span>
        </div>
        <!-- 5 缩略图 -->
        <div class="mt-3 grid grid-cols-5 gap-2">
          <button v-for="(img, i) in product.images" :key="img.type"
                  @click="activeImg = i"
                  :class="['aspect-[4/3] rounded border-2 overflow-hidden transition relative',
                           activeImg === i ? 'border-brand-500 ring-1 ring-brand-300' : 'border-gray-200 hover:border-brand-300']">
            <!-- 真实缩略图 -->
            <img v-if="img.isReal" :src="img.url" :alt="img.label" class="w-full h-full object-cover bg-gray-50" />
            <!-- SVG 缩略图 -->
            <div v-else v-html="img.svg" class="w-full h-full [&>svg]:w-full [&>svg]:h-full bg-gray-50"></div>
            <!-- 缩略图 REAL 标记 -->
            <span v-if="img.isReal"
                  class="absolute bottom-0.5 right-0.5 px-1 text-[8px] font-bold text-white bg-green-500 rounded-tl">R</span>
          </button>
        </div>
        <div class="mt-2 text-center text-xs text-gray-500">
          {{ t('detail.imageType.' + (product.images?.[activeImg]?.type || 'topView')) }}
          ({{ activeImg + 1 }} / {{ product.images?.length }})
          <span v-if="product.images?.[activeImg]?.isReal" class="ml-1 text-green-600 font-medium">📷 REAL PHOTO</span>
        </div>
      </div>

      <!-- Info -->
      <div>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span :class="product.direction === 'Unidirectional' ? 'pill-green' : 'pill-purple'">
            {{ product.direction === 'Unidirectional' ? t('product.uni') : t('product.bi') }}
          </span>
          <span class="pill-blue">{{ product.package }}</span>
          <span v-if="product.tags?.includes('lowCap')"   class="pill-amber">{{ t('product.lowCap') }}</span>
          <span v-if="product.tags?.includes('highSurge')" class="pill-amber">{{ t('product.highSurge') }}</span>
          <span v-if="product.tags?.includes('array')"     class="pill-purple">{{ t('product.array') }}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-brand-500">{{ product.model }}</h1>
        <p class="mt-1 text-sm text-gray-500">{{ product.summary }}</p>

        <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div class="card p-3">
            <div class="text-xs text-gray-400">{{ t('product.workingVoltage') }}</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.vrwm }}</div>
          </div>
          <div class="card p-3">
            <div class="text-xs text-gray-400">{{ t('product.junctionCap') }}</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.cj }}</div>
          </div>
          <div class="card p-3">
            <div class="text-xs text-gray-400">{{ t('product.pulseCurrent') }}</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.ippm }}</div>
          </div>
          <div class="card p-3">
            <div class="text-xs text-gray-400">{{ t('product.pkgQty') }}</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.packageQty }}</div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button @click="downloadSpec" class="btn-outline">📄 {{ t('detail.downloadSpec') }}</button>
          <router-link :to="{ path: '/inquiry', query: { model: product.model } }" class="btn-accent">
            📩 {{ t('detail.sendInquiry') }}
          </router-link>
        </div>
      </div>
    </div>

    <section class="mt-10">
      <h2 class="section-title">{{ t('detail.fullSpec') }}</h2>
      <div class="mt-3 overflow-x-auto card p-0">
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="row in specRows" :key="row.label" class="border-t border-gray-200 first:border-0">
              <th class="bg-gray-50 text-left px-4 py-3 w-48 font-medium text-gray-600">{{ row.label }}</th>
              <td class="px-4 py-3 text-gray-800">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="section-title">{{ t('detail.applications') }}</h2>
      <p class="section-sub">{{ product.applications }}</p>
    </section>

    <section v-if="relatedByPackage.length" class="mt-10">
      <div class="flex items-end justify-between mb-4 flex-wrap gap-2">
        <h2 class="section-title">{{ t('detail.samePackage') }}</h2>
        <router-link :to="`/products?pkg=${encodeURIComponent(product.package)}`" class="text-sm text-accent hover:underline">{{ t('detail.viewAll', { pkg: product.package }) }}</router-link>
      </div>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in relatedByPackage" :key="p.id" :product="p" />
      </div>
    </section>

    <section v-if="relatedByVoltage.length" class="mt-10">
      <div class="flex items-end justify-between mb-4 flex-wrap gap-2">
        <h2 class="section-title">{{ t('detail.sameVoltage') }}</h2>
      </div>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in relatedByVoltage" :key="p.id" :product="p" />
      </div>
    </section>
  </div>

  <div v-else class="container-x py-20 text-center">
    <div class="text-5xl">😢</div>
    <h2 class="mt-3 text-xl font-bold text-brand-500">{{ t('detail.notFound') }}</h2>
    <router-link to="/products" class="mt-4 inline-block btn-primary">{{ t('detail.backToProducts') }}</router-link>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductCard from '@/components/ProductCard.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { getProductById, getRelatedByPackage, getRelatedByVoltage } from '@/data/products.js'

const { t } = useI18n()
const route = useRoute()
const product = computed(() => getProductById(route.params.id))
const relatedByPackage = computed(() => getRelatedByPackage(route.params.id, 4))
const relatedByVoltage = computed(() => getRelatedByVoltage(route.params.id, 4))

const activeImg = ref(0)
watchEffect(() => { activeImg.value = 0 })

watchEffect(() => {
  if (product.value) {
    document.title = `${product.value.model} - ${product.value.package} ESD Diode | Datasheet & Inquiry`
  }
})

const specRows = computed(() => {
  if (!product.value) return []
  const p = product.value
  return [
    { label: t('product.partNumber'),     value: p.model },
    { label: t('product.category'),        value: p.category },
    { label: t('product.package'),         value: p.package },
    { label: t('product.direction'),       value: p.direction },
    { label: t('product.workingVoltage'),  value: p.vrwm },
    { label: t('product.junctionCap'),     value: p.cj },
    { label: t('product.pulseCurrent'),    value: p.ippm },
    { label: t('product.pkgQty'),          value: p.packageQty },
    { label: t('product.rohs'),            value: t('product.compliant') },
    { label: t('product.operatingTemp'),   value: t('product.tempRange') },
    { label: t('product.storageTemp'),     value: t('product.tempRange') },
    { label: t('product.leadFree'),        value: t('product.reflow') }
  ]
})

const downloadSpec = () => {
  alert(`Download datasheet for ${product.value?.model}\n(In production, replace with real PDF link)`)
}
</script>
