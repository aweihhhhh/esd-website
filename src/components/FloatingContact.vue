<template>
  <div class="fixed right-4 bottom-6 z-30 flex flex-col gap-3 no-print">
    <!-- WhatsApp -->
    <a :href="waLink" target="_blank" rel="noopener"
       class="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg grid place-items-center transition"
       aria-label="WhatsApp">
      <svg viewBox="0 0 32 32" class="w-6 h-6 md:w-7 md:h-7" fill="currentColor">
        <path d="M19.11 17.27c-.28-.14-1.66-.82-1.92-.92-.26-.09-.45-.14-.63.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.13-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48-.16-.01-.35-.01-.54-.01-.19 0-.49.07-.74.35-.26.28-.97.95-.97 2.32 0 1.37 1 2.69 1.14 2.88.14.19 1.97 3.01 4.78 4.22 2.81 1.21 2.81.81 3.32.76.51-.05 1.66-.68 1.9-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.33zM16 4C9.38 4 4 9.38 4 16c0 2.11.55 4.16 1.6 5.97L4 28l6.21-1.62A11.93 11.93 0 0 0 16 28c6.62 0 12-5.38 12-12S22.62 4 16 4zm0 21.82c-1.83 0-3.62-.49-5.18-1.41l-.37-.22-3.85 1.01 1.03-3.75-.24-.39A9.85 9.85 0 0 1 6.18 16C6.18 10.6 10.6 6.18 16 6.18S25.82 10.6 25.82 16 21.4 25.82 16 25.82z"/>
      </svg>
      <span class="absolute right-full mr-2 whitespace-nowrap bg-brand-500 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">WhatsApp Us</span>
    </a>

    <!-- Email -->
    <a href="mailto:sales@esd-diode.com"
       class="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg grid place-items-center transition"
       aria-label="Email">
      <svg viewBox="0 0 24 24" class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
      <span class="absolute right-full mr-2 whitespace-nowrap bg-brand-500 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">Email Us</span>
    </a>

    <!-- Back to top -->
    <button v-show="showTop" @click="scrollTop"
            class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg grid place-items-center transition"
            aria-label="Back to top">
      <svg viewBox="0 0 24 24" class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const showTop = ref(false)
const phone = '+8613800000000'
const msg = encodeURIComponent('Hello, I would like to inquire about your ESD protection diodes.')
const waLink = `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`

const onScroll = () => { showTop.value = window.scrollY > 400 }
const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
