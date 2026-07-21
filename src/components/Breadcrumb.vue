<template>
  <nav v-if="items.length" class="text-xs md:text-sm text-gray-500" aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1">
      <li v-for="(it, i) in items" :key="i" class="flex items-center gap-1">
        <router-link v-if="it.to && i < items.length - 1" :to="it.to" class="hover:text-brand-500">{{ it.text }}</router-link>
        <span v-else class="text-brand-500 font-medium">{{ it.text }}</span>
        <span v-if="i < items.length - 1" class="text-gray-400">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
// items: [{ text: 'Home', to: '/' }, { text: 'Products' }, ...]
</script>
