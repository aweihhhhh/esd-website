<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: 'Home', to: '/' }, { text: 'About Us' }]" />

    <!-- Hero -->
    <section class="mt-4 card p-8 md:p-12 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
      <h1 class="text-3xl md:text-4xl font-bold">About ESD Diode Wholesale</h1>
      <p class="mt-3 text-gray-200 max-w-3xl">
        Founded in 2013, we are a professional manufacturer of ESD protection diodes and TVS arrays
        for the global B2B market. With two ISO 9001 certified factories and a 12,000 m² clean room,
        we ship over 800 million pieces annually to more than 60 countries.
      </p>
    </section>

    <!-- Numbers -->
    <section class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div v-for="n in numbers" :key="n.label" class="card p-5">
        <div class="text-2xl md:text-3xl font-extrabold text-brand-500">{{ n.value }}</div>
        <div class="text-xs md:text-sm text-gray-500 mt-1">{{ n.label }}</div>
      </div>
    </section>

    <!-- Strengths -->
    <section class="mt-12 grid gap-6 md:grid-cols-3">
      <div class="card p-6">
        <h3 class="font-semibold text-brand-500 mb-2">🏭 Factory Direct</h3>
        <p class="text-sm text-gray-600">Two production bases with in-house wafer testing, packaging, and QC labs. No middleman, best wholesale price.</p>
      </div>
      <div class="card p-6">
        <h3 class="font-semibold text-brand-500 mb-2">🔬 R&amp;D Capability</h3>
        <p class="text-sm text-gray-600">30+ engineers focused on low capacitance &amp; high surge TVS design. Custom specifications supported.</p>
      </div>
      <div class="card p-6">
        <h3 class="font-semibold text-brand-500 mb-2">🌍 Global Logistics</h3>
        <p class="text-sm text-gray-600">DDP / FOB / EXW trade terms. Long-term cooperation with DHL / FedEx / UPS for fast worldwide delivery.</p>
      </div>
    </section>

    <!-- Certifications -->
    <section class="mt-12">
      <h2 class="section-title">Certifications</h2>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div v-for="c in certs" :key="c" class="card p-4 text-center text-sm text-brand-500 font-medium">
          ✓ {{ c }}
        </div>
      </div>
    </section>

    <!-- Partners -->
    <section class="mt-12">
      <h2 class="section-title">Trusted By</h2>
      <p class="section-sub">OEM / ODM customers across consumer electronics, industrial, automotive, and telecom.</p>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
        <div v-for="i in 12" :key="i" class="card p-6 grid place-items-center text-gray-400 text-xs">LOGO {{ i }}</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'

const numbers = [
  { value: '12+',  label: 'Years OEM Experience' },
  { value: '800M', label: 'Pieces Shipped / Year' },
  { value: '60+',  label: 'Countries Served' },
  { value: '200+', label: 'ESD Models In Stock' }
]
const certs = ['ISO 9001', 'ISO 14001', 'RoHS', 'REACH', 'IATF 16949']
</script>
