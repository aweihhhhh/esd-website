<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.breadcrumbHome'), to: '/' }, { text: t('catalog.title') }]" />

    <div class="mt-4">
      <h1 class="text-2xl md:text-3xl font-bold text-brand-500">{{ t('catalog.title') }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ t('catalog.sub') }}</p>
    </div>

    <section class="mt-6 card p-6 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-brand-50 to-white">
      <div class="text-6xl">📘</div>
      <div class="flex-1">
        <h2 class="text-xl font-bold text-brand-500">{{ t('catalog.masterTitle') }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ t('catalog.masterDesc') }}</p>
        <div class="mt-2 text-xs text-gray-500">PDF · ~8.2 MB · 32 pages · Updated 2026-07</div>
      </div>
      <a href="/catalogs/master-esd-catalog-2026.pdf" download class="btn-accent !py-3 !px-5">
        ⬇ {{ t('common.download') }} PDF
      </a>
    </section>

    <section class="mt-10">
      <h2 class="section-title">{{ t('catalog.byPackage') }}</h2>
      <p class="section-sub">{{ t('catalog.byPackageSub') }}</p>
      <div class="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="p in perPackage" :key="p.pkg" class="card p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded bg-brand-50 text-brand-500 grid place-items-center text-xl">📄</div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-brand-500 truncate">{{ p.pkg }} Series</div>
            <div class="text-xs text-gray-500">{{ p.count }} models · {{ p.size }}</div>
          </div>
          <a :href="`/catalogs/${p.file}`" download
             class="btn-outline !py-1.5 !px-3 !text-xs whitespace-nowrap">{{ t('common.download') }}</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { packageOptions, products } from '@/data/products.js'

const { t } = useI18n()

const perPackage = computed(() => packageOptions.map(pkg => {
  const count = products.filter(p => p.package === pkg).length
  return {
    pkg,
    count,
    size: count > 30 ? '~2.1 MB' : count > 10 ? '~1.2 MB' : '~0.6 MB',
    file: `${pkg.toLowerCase()}-series.pdf`
  }
}))
</script>
