<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <!-- Top utility bar -->
    <div class="bg-brand-500 text-white text-xs">
      <div class="container-x flex items-center justify-between h-9">
        <div class="flex items-center gap-4">
          <span class="hidden sm:inline">📧 sales@esd-diode.com</span>
          <span class="hidden md:inline">📱 +86 138 0000 0000</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden sm:inline">Mon - Sat  9:00 - 18:00 (GMT+8)</span>
          <a href="#/" class="hover:underline">EN</a>
        </div>
      </div>
    </div>

    <!-- Main navigation bar -->
    <div class="container-x flex items-center justify-between h-16">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-9 h-9 rounded-md bg-brand-500 grid place-items-center text-white font-bold tracking-wide">ESD</div>
        <div class="leading-tight">
          <div class="text-base font-bold text-brand-500 group-hover:text-brand-600">ESD Diode Wholesale</div>
          <div class="text-[10px] text-gray-500 -mt-0.5">Factory Direct • Global B2B</div>
        </div>
      </router-link>

      <!-- Desktop menu -->
      <nav class="hidden lg:flex items-center gap-1">
        <router-link v-for="m in menus" :key="m.path" :to="m.path"
                     class="px-3 py-2 rounded text-sm font-medium text-gray-700 hover:text-brand-500 hover:bg-brand-50 transition"
                     active-class="text-brand-500 bg-brand-50">
          {{ m.label }}
        </router-link>
      </nav>

      <!-- CTA + mobile toggle -->
      <div class="flex items-center gap-2">
        <router-link to="/inquiry" class="hidden sm:inline-flex btn-accent !py-2 !px-4 text-xs">
          ⚡ Get a Quote
        </router-link>
        <button class="lg:hidden p-2 rounded hover:bg-gray-100" @click="open = !open" aria-label="menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="slide">
      <div v-show="open" class="lg:hidden border-t border-gray-200 bg-white">
        <div class="container-x py-2 flex flex-col">
          <router-link v-for="m in menus" :key="m.path" :to="m.path"
                       class="py-2.5 text-sm font-medium text-gray-700 border-b border-gray-100 last:border-0"
                       active-class="text-brand-500"
                       @click="open = false">
            {{ m.label }}
          </router-link>
          <router-link to="/inquiry" class="mt-2 btn-accent text-sm" @click="open = false">⚡ Get a Quote</router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)

const menus = [
  { path: '/',         label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/catalog',  label: 'Catalog' },
  { path: '/about',    label: 'About Us' },
  { path: '/contact',  label: 'Contact' }
]
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: max-height 0.25s ease, opacity 0.2s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to       { max-height: 0; opacity: 0; }
.slide-enter-to,   .slide-leave-from     { max-height: 480px; opacity: 1; }
</style>
