<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: 'Home', to: '/' }, { text: 'Catalog Download' }]" />

    <div class="mt-4">
      <h1 class="text-2xl md:text-3xl font-bold text-brand-500">Product Catalog Download</h1>
      <p class="text-sm text-gray-500 mt-1">Download the latest ESD protection diode catalog by package, or get the full master catalog.</p>
    </div>

    <!-- Master catalog -->
    <section class="mt-6 card p-6 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-brand-50 to-white">
      <div class="text-6xl">📘</div>
      <div class="flex-1">
        <h2 class="text-xl font-bold text-brand-500">Master ESD Catalog 2026 (Full Version)</h2>
        <p class="text-sm text-gray-600 mt-1">All 200+ ESD / TVS models in one PDF. Includes package dimensions, electrical characteristics, reflow profiles, and reliability reports.</p>
        <div class="mt-2 text-xs text-gray-500">PDF · ~8.2 MB · 32 pages · Updated 2026-07</div>
      </div>
      <a href="/catalogs/master-esd-catalog-2026.pdf" download class="btn-accent !py-3 !px-5">
        ⬇ Download Master PDF
      </a>
    </section>

    <!-- Per package catalog -->
    <section class="mt-10">
      <h2 class="section-title">Download by Package</h2>
      <p class="section-sub">Smaller PDFs (1-3 MB) for buyers who only need a specific package series.</p>
      <div class="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="p in perPackage" :key="p.pkg" class="card p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded bg-brand-50 text-brand-500 grid place-items-center text-xl">📄</div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-brand-500 truncate">{{ p.pkg }} Series</div>
            <div class="text-xs text-gray-500">{{ p.count }} models · {{ p.size }}</div>
          </div>
          <a :href="`/catalogs/${p.file}`" download
             class="btn-outline !py-1.5 !px-3 !text-xs whitespace-nowrap">Download</a>
        </div>
      </div>
    </section>

    <p class="text-xs text-gray-400 mt-8">
      💡 Note: PDF files in this demo are placeholders. In production, place real PDFs under
      <code class="bg-gray-100 px-1 rounded">/public/catalogs/</code> with the exact filenames below.
    </p>
  </div>
</template>

<script setup>
import { packageOptions } from '@/data/products.js'
import { products } from '@/data/products.js'
import Breadcrumb from '@/components/Breadcrumb.vue'

const perPackage = packageOptions.map(pkg => {
  const count = products.filter(p => p.package === pkg).length
  return {
    pkg,
    count,
    size: count > 30 ? '~2.1 MB' : count > 10 ? '~1.2 MB' : '~0.6 MB',
    file: `${pkg.toLowerCase()}-series.pdf`
  }
})
</script>
