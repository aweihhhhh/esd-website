<template>
  <footer class="bg-brand-500 text-gray-300 mt-16">
    <div class="container-x py-12 grid gap-10 md:grid-cols-4">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 rounded-md bg-white grid place-items-center text-brand-500 font-bold">ESD</div>
          <div class="text-white font-bold text-lg">ESD Diode Wholesale</div>
        </div>
        <p class="text-sm leading-6">
          Professional ESD protection diode and TVS array manufacturer &amp; wholesaler.
          Factory direct supply with global B2B service for over 12 years.
        </p>
        <div class="flex items-center gap-3 mt-4">
          <a href="#" class="w-9 h-9 rounded bg-brand-600 hover:bg-accent grid place-items-center transition" aria-label="LinkedIn">in</a>
          <a href="#" class="w-9 h-9 rounded bg-brand-600 hover:bg-accent grid place-items-center transition" aria-label="Facebook">f</a>
          <a href="#" class="w-9 h-9 rounded bg-brand-600 hover:bg-accent grid place-items-center transition" aria-label="YouTube">▶</a>
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h4 class="text-white font-semibold mb-3">Quick Links</h4>
        <ul class="space-y-2 text-sm">
          <li><router-link to="/products" class="hover:text-white">All Products</router-link></li>
          <li><router-link to="/catalog"  class="hover:text-white">Download Catalog</router-link></li>
          <li><router-link to="/inquiry"  class="hover:text-white">Send Inquiry</router-link></li>
          <li><router-link to="/about"    class="hover:text-white">About Us</router-link></li>
        </ul>
      </div>

      <!-- Products by package -->
      <div>
        <h4 class="text-white font-semibold mb-3">Popular Packages</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="p in popularPackages" :key="p">
            <router-link :to="`/products?pkg=${encodeURIComponent(p)}`" class="hover:text-white">
              {{ p }} ESD Diode
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="text-white font-semibold mb-3">Contact</h4>
        <ul class="space-y-2 text-sm">
          <li>📍 Building 7, Hi-Tech Industrial Park, Shenzhen, China</li>
          <li>📧 sales@esd-diode.com</li>
          <li>📱 +86 138 0000 0000 (WhatsApp)</li>
          <li>🕘 Mon - Sat 9:00 - 18:00 (GMT+8)</li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-brand-600/50">
      <div class="container-x py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <div>© {{ year }} ESD Diode Wholesale. All Rights Reserved.</div>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white">Privacy Policy</a>
          <a href="#" class="hover:text-white">Terms of Service</a>
          <a href="#" class="hover:text-white">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const popularPackages = ['SOD323', 'SOD523', 'DFN1006-2L', 'SOT23', 'DFN0603-2L']
</script>
