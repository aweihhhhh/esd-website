<template>
  <div>
    <!-- Hero Carousel (rotating top products) -->
    <HeroCarousel />

    <!-- Advantages -->
    <section class="container-x py-14 md:py-20">
      <div class="text-center mb-10">
        <h2 class="section-title">{{ t('home.advantagesTitle') }}</h2>
        <p class="section-sub">{{ t('home.advantagesSub') }}</p>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div v-for="a in advantages" :key="a.title" class="card p-5 text-center hover:shadow-md transition">
          <div class="w-12 h-12 rounded-lg bg-brand-50 text-brand-500 grid place-items-center mx-auto mb-3 text-xl">{{ a.icon }}</div>
          <h3 class="font-semibold text-sm md:text-base text-brand-500">{{ a.title }}</h3>
          <p class="mt-1.5 text-xs md:text-sm text-gray-500">{{ a.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Hot Products Grid -->
    <section class="bg-gray-50 py-14 md:py-20">
      <div class="container-x">
        <div class="flex items-end justify-between mb-8 flex-wrap gap-2">
          <div>
            <h2 class="section-title">{{ t('home.hotTitle') }}</h2>
            <p class="section-sub">{{ t('home.hotSub') }}</p>
          </div>
          <router-link to="/products" class="btn-outline !py-2 !px-4 text-xs">{{ t('products.title') }} →</router-link>
        </div>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in hotProducts" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- Inquiry CTA -->
    <section class="bg-brand-500 text-white">
      <div class="container-x py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold">{{ t('home.ctaTitle') }}</h2>
          <p class="mt-2 text-gray-200 text-sm md:text-base">{{ t('home.ctaSub') }}</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link to="/inquiry" class="btn-accent !py-3 !px-6 text-sm">📩 {{ t('inquiry.submit') }}</router-link>
          <a href="https://wa.me/8613800000000" target="_blank" class="btn !py-3 !px-6 text-sm bg-white text-brand-500 hover:bg-gray-100">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeroCarousel from '@/components/HeroCarousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/data/products.js'

const { t, tm } = useI18n()

const advantages = computed(() => tm('home.advantages'))
const hotProducts = computed(() => {
  const list = ['sod323-gblc05c','sod323-gblc03c','sot363-esd0504f','dfn1006-2l-esd8ll5-0c',
                'sot23-sm05cc','sod323-sd05','dfn1006-2l-esd8l3-3','sot23-sm712']
  return list.map(id => products.find(p => p.id === id)).filter(Boolean).slice(0, 8)
})
</script>
