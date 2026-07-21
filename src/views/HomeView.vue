<template>
  <div>
    <!-- ============== Hero Banner ============== -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-500 to-brand-700 text-white">
      <!-- 背景占位 - 后续替换为工业电子元件图片：
           <img src="/assets/hero-pcb.jpg" class="absolute inset-0 w-full h-full object-cover opacity-25" /> -->
      <div class="absolute inset-0 opacity-10" aria-hidden="true">
        <svg class="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div class="container-x relative py-20 md:py-28">
        <div class="max-w-3xl">
          <span class="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-medium mb-4">
            🏭 Factory Direct • 12+ Years • Global B2B
          </span>
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            ESD Surge Protection <br class="hidden md:block"/>
            Diode Wholesale
          </h1>
          <p class="mt-5 text-base md:text-lg text-gray-200 max-w-2xl">
            200+ SMD ESD protection diodes and TVS arrays in stock — SOD323, SOD523, DFN1006, SOT23.
            Low capacitance for high-speed lines, high surge current for industrial protection.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <router-link to="/products" class="btn-accent !py-3 !px-6 text-sm">
              🔍 Browse All Products
            </router-link>
            <router-link to="/catalog" class="btn !py-3 !px-6 text-sm bg-white text-brand-500 hover:bg-gray-100">
              📄 Download Catalog PDF
            </router-link>
          </div>
          <div class="mt-8 flex flex-wrap gap-6 text-sm text-gray-200">
            <div>✓ ISO 9001 Certified</div>
            <div>✓ RoHS / REACH Compliant</div>
            <div>✓ MOQ from 1,000 pcs</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============== Core Advantages ============== -->
    <section class="container-x py-14 md:py-20">
      <div class="text-center mb-10">
        <h2 class="section-title">Why Choose Us</h2>
        <p class="section-sub">A trusted ESD diode manufacturer &amp; global B2B wholesaler</p>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div v-for="a in advantages" :key="a.title" class="card p-5 text-center hover:shadow-md transition">
          <div class="w-12 h-12 rounded-lg bg-brand-50 text-brand-500 grid place-items-center mx-auto mb-3 text-xl">{{ a.icon }}</div>
          <h3 class="font-semibold text-sm md:text-base text-brand-500">{{ a.title }}</h3>
          <p class="mt-1.5 text-xs md:text-sm text-gray-500">{{ a.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ============== Hot Products ============== -->
    <section class="bg-gray-50 py-14 md:py-20">
      <div class="container-x">
        <div class="flex items-end justify-between mb-8 flex-wrap gap-2">
          <div>
            <h2 class="section-title">Hot Selling Products</h2>
            <p class="section-sub">Best sellers for USB / HDMI / charging ports &amp; industrial protection</p>
          </div>
          <router-link to="/products" class="btn-outline !py-2 !px-4 text-xs">View All →</router-link>
        </div>

        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in hotProducts" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- ============== Specs Comparison ============== -->
    <section class="container-x py-14 md:py-20">
      <div class="text-center mb-8">
        <h2 class="section-title">Package Size Comparison</h2>
        <p class="section-sub">Choose the right SMD package for your PCB design</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-brand-500 text-white">
            <tr>
              <th class="text-left px-4 py-3">Package</th>
              <th class="text-left px-4 py-3">Size (mm)</th>
              <th class="text-left px-4 py-3">Typical Models</th>
              <th class="text-left px-4 py-3">Application</th>
            </tr>
          </thead>
          <tbody class="table-zebra">
            <tr v-for="row in packageTable" :key="row.pkg" class="border-t border-gray-200">
              <td class="px-4 py-3 font-semibold text-brand-500">{{ row.pkg }}</td>
              <td class="px-4 py-3">{{ row.size }}</td>
              <td class="px-4 py-3 text-gray-700">{{ row.models }}</td>
              <td class="px-4 py-3 text-gray-700">{{ row.app }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ============== Inquiry CTA ============== -->
    <section class="bg-brand-500 text-white">
      <div class="container-x py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold">Need a Custom ESD Solution?</h2>
          <p class="mt-2 text-gray-200 text-sm md:text-base">Send us your BOM or requirements. Our engineers reply within 12 hours.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link to="/inquiry" class="btn-accent !py-3 !px-6 text-sm">📩 Send Inquiry Now</router-link>
          <a href="https://wa.me/8613800000000" target="_blank" class="btn !py-3 !px-6 text-sm bg-white text-brand-500 hover:bg-gray-100">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/data/products.js'

const advantages = [
  { icon: '⚡', title: 'Low Capacitance High Speed ESD', desc: 'As low as 0.05pF for USB 3.0 / HDMI / Thunderbolt' },
  { icon: '🛡', title: 'High Surge Current TVS',       desc: 'Up to 170A peak pulse current for industrial protection' },
  { icon: '📦', title: 'Multi SMD Package',             desc: 'SOD923 / SOD523 / SOD323 / DFN / SOT23 series' },
  { icon: '🏭', title: 'Factory Direct Supply',         desc: 'No middleman, best wholesale price, 12+ years OEM' },
  { icon: '🚀', title: 'Fast Delivery',                 desc: 'In-stock items ship within 48 hours globally' }
]

// 热门产品：低电容 + 大电流 + 部分典型型号
// 注：id 格式为 "{package-slug}-{model-slug}"（小写，特殊字符替换为 -）
const hotProducts = computed(() => {
  const list = [
    'sod323-gblc05c',       // 5V 低电容 20A
    'sod323-gblc03c',       // 3.3V 低电容 20A
    'sot363-esd0504f',      // 5V 阵列
    'dfn1006-2l-esd8ll5-0c',// 5V 超低电容 0.35pF
    'sot23-sm05cc',         // 5V 大电流 35A
    'sod323-sd05',          // 5V 经典款
    'dfn1006-2l-esd8l3-3',  // 3.3V 超低电容 0.4pF
    'sot23-sm712',          // 7V+12V 阵列
    'sod523-esd5l5-0c',     // 5V 双向低电容
    'sod323-pesd1lin'       // 15V+24V 车载级
  ]
  return list.map(id => products.find(p => p.id === id)).filter(Boolean).slice(0, 8)
})

const packageTable = [
  { pkg: 'DFN0603-2L', size: '0.6 × 0.3',  models: 'ESD11xx Series',  app: 'Wearable, mobile phones' },
  { pkg: 'DFN1006-2L', size: '1.0 × 0.6',  models: 'ESD8xx Series',   app: 'USB, HDMI, charging port' },
  { pkg: 'SOD923',     size: '1.0 × 0.6',  models: 'ESD9xx Series',   app: 'Compact mobile devices' },
  { pkg: 'SOD523',     size: '1.6 × 0.8',  models: 'ESD5xx Series',   app: 'Consumer electronics' },
  { pkg: 'SOD323',     size: '2.5 × 1.25', models: 'SDxx / GBLCxx',   app: 'USB 2.0, data lines' },
  { pkg: 'SOT23',      size: '2.9 × 1.6',  models: 'SMxx Series',     app: 'Industrial, automotive' }
]
</script>
