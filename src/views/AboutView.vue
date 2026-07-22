<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.breadcrumbHome'), to: '/' }, { text: t('nav.about') }]" />

    <section class="mt-4 card p-8 md:p-12 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
      <h1 class="text-3xl md:text-4xl font-bold">{{ t('about.title') }}</h1>
      <p class="mt-3 text-gray-200 max-w-3xl">{{ t('about.sub') }}</p>
    </section>

    <section class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div v-for="n in numbers" :key="n.label" class="card p-5">
        <div class="text-2xl md:text-3xl font-extrabold text-brand-500">{{ n.value }}</div>
        <div class="text-xs md:text-sm text-gray-500 mt-1">{{ n.label }}</div>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="section-title">{{ t('about.certsTitle') }}</h2>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div v-for="c in certs" :key="c" class="card p-4 text-center text-sm text-brand-500 font-medium">
          ✓ {{ c }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '@/components/Breadcrumb.vue'

const { t, tm } = useI18n()
const numbers = computed(() => tm('about.numbers'))
const certs = computed(() => tm('about.certs'))
</script>
