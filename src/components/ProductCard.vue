<template>
  <div class="card-hover overflow-hidden flex flex-col">
    <!-- Image: 程序化生成的 SVG 示意图 (Top View) -->
    <div class="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
      <img v-if="product.images?.[0]"
           :src="product.images[0].dataUri"
           :alt="`${product.model} Top View`"
           class="w-full h-full object-contain" />
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span v-if="product.tags?.includes('lowCap')"  class="pill-blue">{{ t('product.lowCap') }}</span>
        <span v-if="product.tags?.includes('highSurge')" class="pill-amber">{{ t('product.highSurge') }}</span>
        <span v-if="product.tags?.includes('array')"    class="pill-purple">{{ t('product.array') }}</span>
      </div>
      <div class="absolute top-2 right-2">
        <input v-if="selectable" type="checkbox" :checked="selected" @change="$emit('toggle', product.id)"
               class="w-4 h-4 accent-brand-500 cursor-pointer" :aria-label="`select ${product.model}`" />
      </div>
      <div class="absolute bottom-1 right-2 text-[10px] text-gray-400 bg-white/70 px-1 rounded">
        {{ t('card.images', { n: product.images?.length || 0 }) }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] uppercase tracking-wider text-gray-400">{{ product.package }}</span>
        <span :class="product.direction === 'Unidirectional' ? 'pill-green' : 'pill-purple'">
          {{ product.direction === 'Unidirectional' ? t('product.uni') : t('product.bi') }}
        </span>
      </div>

      <router-link :to="`/products/${product.id}`"
                   class="text-sm md:text-base font-semibold text-brand-500 hover:text-brand-600 truncate">
        {{ product.model }}
      </router-link>

      <ul class="mt-2 text-xs text-gray-600 space-y-0.5">
        <li class="flex justify-between"><span>{{ t('product.vrwm') }}</span><span class="font-medium text-gray-800">{{ product.vrwm }}</span></li>
        <li class="flex justify-between"><span>{{ t('product.cj') }}</span><span class="font-medium text-gray-800">{{ product.cj }}</span></li>
        <li class="flex justify-between"><span>{{ t('product.ippm') }}</span><span class="font-medium text-gray-800">{{ product.ippm }}</span></li>
        <li class="flex justify-between"><span>{{ t('product.packageQty') }}</span><span class="font-medium text-gray-800">{{ product.packageQty }}</span></li>
      </ul>

      <div class="mt-3 flex items-center gap-2">
        <router-link :to="`/products/${product.id}`" class="btn-outline flex-1 !py-1.5 !text-xs">{{ t('card.details') }}</router-link>
        <router-link :to="{ path: '/inquiry', query: { model: product.model } }" class="btn-primary flex-1 !py-1.5 !text-xs">
          {{ t('card.inquire') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  product: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false }
})
defineEmits(['toggle'])
</script>