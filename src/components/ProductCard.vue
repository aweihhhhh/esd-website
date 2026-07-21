<template>
  <div class="card-hover overflow-hidden flex flex-col">
    <!-- Image placeholder -->
    <div class="relative h-40 bg-gradient-to-br from-brand-50 to-gray-100 flex items-center justify-center">
      <!-- 图片占位区 - 后期替换为真实产品图：
           <img :src="product.image" :alt="product.model" /> -->
      <svg viewBox="0 0 100 60" class="w-28 h-16 text-brand-300">
        <rect x="6"  y="18" width="32" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <rect x="62" y="18" width="32" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <line x1="0" y1="30" x2="6"  y2="30" stroke="currentColor" stroke-width="1.5"/>
        <line x1="0" y1="30" x2="6"  y2="30" stroke="currentColor" stroke-width="1.5"/>
        <line x1="94" y1="30" x2="100" y2="30" stroke="currentColor" stroke-width="1.5"/>
        <text x="50" y="34" text-anchor="middle" font-size="8" fill="currentColor">ESD</text>
      </svg>
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span v-if="product.tags?.includes('lowCap')"  class="pill-blue">Low Cap</span>
        <span v-if="product.tags?.includes('highSurge')" class="pill-amber">High Surge</span>
        <span v-if="product.tags?.includes('array')"    class="pill-purple">Array</span>
      </div>
      <div class="absolute top-2 right-2">
        <input v-if="selectable" type="checkbox" :checked="selected" @change="$emit('toggle', product.id)"
               class="w-4 h-4 accent-brand-500 cursor-pointer" :aria-label="`select ${product.model}`" />
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] uppercase tracking-wider text-gray-400">{{ product.package }}</span>
        <span :class="product.direction === 'Unidirectional' ? 'pill-green' : 'pill-purple'">
          {{ product.direction === 'Unidirectional' ? 'Uni' : 'Bi' }}
        </span>
      </div>

      <router-link :to="`/products/${product.id}`"
                   class="text-sm md:text-base font-semibold text-brand-500 hover:text-brand-600 truncate">
        {{ product.model }}
      </router-link>

      <ul class="mt-2 text-xs text-gray-600 space-y-0.5">
        <li class="flex justify-between"><span>VRWM</span><span class="font-medium text-gray-800">{{ product.vrwm }}</span></li>
        <li class="flex justify-between"><span>Cj (TYP)</span><span class="font-medium text-gray-800">{{ product.cj }}</span></li>
        <li class="flex justify-between"><span>IPPM</span><span class="font-medium text-gray-800">{{ product.ippm }}</span></li>
        <li class="flex justify-between"><span>Package</span><span class="font-medium text-gray-800">{{ product.packageQty }}</span></li>
      </ul>

      <div class="mt-3 flex items-center gap-2">
        <router-link :to="`/products/${product.id}`" class="btn-outline flex-1 !py-1.5 !text-xs">Details</router-link>
        <router-link :to="{ path: '/inquiry', query: { model: product.model } }" class="btn-primary flex-1 !py-1.5 !text-xs">
          Inquire
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false }
})
defineEmits(['toggle'])
</script>
