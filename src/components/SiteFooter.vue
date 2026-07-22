<template>
  <footer class="bg-brand-500 text-gray-300 mt-16">
    <div class="container-x py-12 grid gap-10 md:grid-cols-4">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 rounded-md bg-white grid place-items-center text-brand-500 font-bold">ESD</div>
          <div class="text-white font-bold text-lg">{{ t('footer.brand') }}</div>
        </div>
        <p class="text-sm leading-6">{{ t('footer.desc') }}</p>
        <div class="flex items-center gap-3 mt-4">
          <a href="#" class="w-9 h-9 rounded bg-brand-600 hover:bg-accent grid place-items-center transition" :aria-label="'LinkedIn'">in</a>
          <a href="#" class="w-9 h-9 rounded bg-brand-600 hover:bg-accent grid place-items-center transition" :aria-label="'Facebook'">f</a>
          <a href="#" class="w-9 h-9 rounded bg-brand-600 hover:bg-accent grid place-items-center transition" :aria-label="'YouTube'">▶</a>
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h4 class="text-white font-semibold mb-3">{{ t('footer.quickLinks') }}</h4>
        <ul class="space-y-2 text-sm">
          <li><router-link to="/products" class="hover:text-white">{{ t('footer.allProducts') }}</router-link></li>
          <li><router-link to="/catalog"  class="hover:text-white">{{ t('footer.downloadCatalog') }}</router-link></li>
          <li><router-link to="/inquiry"  class="hover:text-white">{{ t('footer.sendInquiry') }}</router-link></li>
          <li><router-link to="/about"    class="hover:text-white">{{ t('footer.aboutUs') }}</router-link></li>
        </ul>
      </div>

      <!-- Products by package -->
      <div>
        <h4 class="text-white font-semibold mb-3">{{ t('footer.popularPackages') }}</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="p in popularPackages" :key="p">
            <router-link :to="`/products?pkg=${encodeURIComponent(p)}`" class="hover:text-white">
              {{ t('footer.packageItem', { pkg: p }) }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="text-white font-semibold mb-3">{{ t('footer.contact') }}</h4>
        <ul class="space-y-2 text-sm">
          <li>📍 {{ t('footer.address') }}</li>
          <li>📧 sales@esd-diode.com</li>
          <li>📱 {{ t('footer.phone') }}</li>
          <li>🕘 {{ t('header.hours') }}</li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-brand-600/50">
      <div class="container-x py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <div>{{ t('footer.copyright', { year }) }}</div>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white">{{ t('footer.privacy') }}</a>
          <a href="#" class="hover:text-white">{{ t('footer.terms') }}</a>
          <a href="#" class="hover:text-white">{{ t('footer.sitemap') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const year = new Date().getFullYear()
const popularPackages = ['SOD323', 'SOD523', 'DFN1006-2L', 'SOT23', 'DFN0603-2L']
</script>