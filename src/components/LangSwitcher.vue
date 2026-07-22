<template>
  <div class="relative inline-block">
    <button @click="open = !open" @blur="onBlur"
            class="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-brand-50 text-gray-700">
      <span>{{ current.flag }}</span>
      <span class="hidden md:inline">{{ current.name }}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" class="ml-0.5">
        <path d="M5 7L1 3h8z"/>
      </svg>
    </button>
    <transition name="fade">
      <ul v-show="open"
          class="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
        <li v-for="l in SUPPORTED_LOCALES" :key="l.code">
          <button @mousedown.prevent="switchTo(l.code)"
                  :class="['w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-brand-50',
                           i18n.global.locale.value === l.code ? 'text-brand-500 font-semibold bg-brand-50' : 'text-gray-700']">
            <span class="text-base">{{ l.flag }}</span>
            <span>{{ l.name }}</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { i18n, SUPPORTED_LOCALES, setLocale } from '@/locales'

const open = ref(false)
const current = computed(() =>
  SUPPORTED_LOCALES.find(l => l.code === i18n.global.locale.value) || SUPPORTED_LOCALES[0]
)
const switchTo = (code) => {
  setLocale(code)
  open.value = false
}
const onBlur = () => setTimeout(() => open.value = false, 150)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
