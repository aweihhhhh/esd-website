<template>
  <div class="container-x py-20 text-center">
    <div class="text-7xl md:text-9xl font-extrabold text-brand-500">404</div>
    <h1 class="mt-4 text-2xl font-bold text-brand-500">{{ t('notFound.title') }}</h1>
    <p class="mt-2 text-gray-500 max-w-md mx-auto">{{ t('notFound.desc') }}</p>
    <div class="mt-6 flex items-center justify-center gap-3 flex-wrap">
      <router-link to="/" class="btn-primary">← {{ t('common.home') }}</router-link>
      <router-link to="/products" class="btn-outline">{{ t('nav.products') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
