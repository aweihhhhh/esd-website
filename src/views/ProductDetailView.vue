<template>
  <div class="container-x py-6" v-if="product">
    <!-- Breadcrumb -->
    <Breadcrumb :items="[
      { text: 'Home', to: '/' },
      { text: 'Products', to: '/products' },
      { text: product.package, to: `/products?pkg=${encodeURIComponent(product.package)}` },
      { text: product.model }
    ]" />

    <!-- ============== Top section ============== -->
    <div class="mt-4 grid gap-6 md:grid-cols-2">
      <!-- Image gallery: 5 SVG views -->
      <div class="card p-6 flex flex-col">
        <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden grid place-items-center">
          <img v-if="product.images?.[activeImg]"
               :src="product.images[activeImg].dataUri"
               :alt="`${product.model} - ${product.images[activeImg].label}`"
               class="w-full h-full object-contain" />
        </div>
        <!-- Thumbnail strip: 5 views -->
        <div class="mt-3 grid grid-cols-5 gap-2">
          <button v-for="(img, i) in product.images" :key="img.type"
                  @click="activeImg = i"
                  :class="['aspect-[4/3] rounded border-2 overflow-hidden transition',
                           activeImg === i ? 'border-brand-500 ring-1 ring-brand-300' : 'border-gray-200 hover:border-brand-300']">
            <img :src="img.dataUri" :alt="img.label" class="w-full h-full object-contain bg-gray-50" />
          </button>
        </div>
        <!-- Image label -->
        <div class="mt-2 text-center text-xs text-gray-500">
          {{ product.images?.[activeImg]?.label }} ({{ activeImg + 1 }} / {{ product.images?.length }})
        </div>
      </div>

      <!-- Info -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span :class="product.direction === 'Unidirectional' ? 'pill-green' : 'pill-purple'">
            {{ product.direction }}
          </span>
          <span class="pill-blue">{{ product.package }}</span>
          <span v-if="product.tags?.includes('lowCap')"   class="pill-amber">Low Cap</span>
          <span v-if="product.tags?.includes('highSurge')" class="pill-amber">High Surge</span>
          <span v-if="product.tags?.includes('array')"     class="pill-purple">Array</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-brand-500">{{ product.model }}</h1>
        <p class="mt-1 text-sm text-gray-500">{{ product.summary }}</p>

        <!-- Quick specs -->
        <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div class="card p-3">
            <div class="text-xs text-gray-400">VRWM (Working Voltage)</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.vrwm }}</div>
          </div>
          <div class="card p-3">
            <div class="text-xs text-gray-400">CJ (TYP) Junction Capacitance</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.cj }}</div>
          </div>
          <div class="card p-3">
            <div class="text-xs text-gray-400">IPPM Max Pulse Current</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.ippm }}</div>
          </div>
          <div class="card p-3">
            <div class="text-xs text-gray-400">Package Quantity</div>
            <div class="text-lg font-semibold text-brand-500">{{ product.packageQty }}</div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-6 flex flex-wrap gap-3">
          <button @click="downloadSpec" class="btn-outline">📄 Download Spec Sheet</button>
          <router-link :to="{ path: '/inquiry', query: { model: product.model } }" class="btn-accent">
            📩 Send Inquiry Now
          </router-link>
        </div>
      </div>
    </div>

    <!-- ============== Full spec table ============== -->
    <section class="mt-10">
      <h2 class="section-title">Full Specifications</h2>
      <div class="mt-3 overflow-x-auto card p-0">
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="row in specRows" :key="row.label" class="border-t border-gray-200 first:border-0">
              <th class="bg-gray-50 text-left px-4 py-3 w-48 font-medium text-gray-600">{{ row.label }}</th>
              <td class="px-4 py-3 text-gray-800">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ============== Applications ============== -->
    <section class="mt-10">
      <h2 class="section-title">Typical Applications</h2>
      <p class="section-sub">{{ product.applications }}</p>
      <div class="mt-4 grid gap-3 grid-cols-2 md:grid-cols-4">
        <div v-for="app in appCards" :key="app.title" class="card p-4 text-center">
          <div class="text-2xl">{{ app.icon }}</div>
          <div class="mt-1 text-sm font-medium text-brand-500">{{ app.title }}</div>
          <div class="text-xs text-gray-500">{{ app.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ============== Related products ============== -->
    <section v-if="relatedByPackage.length" class="mt-10">
      <div class="flex items-end justify-between mb-4 flex-wrap gap-2">
        <h2 class="section-title">Same Package Alternatives</h2>
        <router-link :to="`/products?pkg=${encodeURIComponent(product.package)}`" class="text-sm text-accent hover:underline">View all {{ product.package }} →</router-link>
      </div>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in relatedByPackage" :key="p.id" :product="p" />
      </div>
    </section>

    <section v-if="relatedByVoltage.length" class="mt-10">
      <div class="flex items-end justify-between mb-4 flex-wrap gap-2">
        <h2 class="section-title">Same Voltage Across Packages</h2>
      </div>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in relatedByVoltage" :key="p.id" :product="p" />
      </div>
    </section>
  </div>

  <!-- Not found -->
  <div v-else class="container-x py-20 text-center">
    <div class="text-5xl">😢</div>
    <h2 class="mt-3 text-xl font-bold text-brand-500">Product not found</h2>
    <router-link to="/products" class="mt-4 inline-block btn-primary">Back to all products</router-link>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { getProductById, getRelatedByPackage, getRelatedByVoltage } from '@/data/products.js'

const route = useRoute()
const product = computed(() => getProductById(route.params.id))
const relatedByPackage = computed(() => getRelatedByPackage(route.params.id, 4))
const relatedByVoltage = computed(() => getRelatedByVoltage(route.params.id, 4))

// 当前展示的图片索引 (0-4)
const activeImg = ref(0)
watchEffect(() => { activeImg.value = 0 }) // 切换产品时重置

// SEO: 动态 title & meta
watchEffect(() => {
  if (product.value) {
    document.title = `${product.value.model} - ${product.value.package} ESD Diode | Datasheet & Inquiry`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content',
      `${product.value.model} ${product.value.package} ${product.value.direction} ESD protection diode, VRWM ${product.value.vrwm}, Cj ${product.value.cj}, IPPM ${product.value.ippm}. Wholesale price, datasheet download, online inquiry.`
    )
  }
})

// 完整规格行
const specRows = computed(() => {
  if (!product.value) return []
  const p = product.value
  return [
    { label: 'Part Number',         value: p.model },
    { label: 'Category',           value: p.category },
    { label: 'Package',            value: p.package },
    { label: 'Direction / Polarity', value: p.direction },
    { label: 'VRWM (Working Voltage)', value: p.vrwm },
    { label: 'CJ (TYP) Junction Capacitance', value: p.cj },
    { label: 'IPPM (Max Pulse Current)', value: p.ippm },
    { label: 'Package Quantity',   value: p.packageQty },
    { label: 'RoHS / REACH',       value: 'Compliant' },
    { label: 'Operating Temperature', value: '-55°C ~ +150°C' },
    { label: 'Storage Temperature', value: '-55°C ~ +150°C' },
    { label: 'Lead-free Reflow',   value: '260°C / 10s' }
  ]
})

const appCards = [
  { icon: '🔌', title: 'USB / HDMI / Type-C',  desc: 'High-speed data line ESD protection' },
  { icon: '📱', title: 'Mobile & Wearable',     desc: 'Charging port, button, audio line' },
  { icon: '🚗', title: 'Automotive Electronics', desc: 'CAN, LVDS, ECU interfaces' },
  { icon: '🏭', title: 'Industrial Control',    desc: 'PLC, RS485, sensor lines' }
]

// 模拟下载 datasheet (实际项目可指向后端 PDF)
const downloadSpec = () => {
  alert(`Download datasheet for ${product.value?.model}\n(In production, replace with real PDF link)`)
}
</script>
