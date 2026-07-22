<template>
  <div class="card-hover overflow-hidden flex flex-col group">
    <!-- Image: 优先真实图片 (isReal), 否则 SVG 程序生成 -->
    <div class="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
      <!-- 真实图片 (jpg/png/webp) -->
      <img v-if="mainImage?.isReal"
           :src="mainImage.url"
           :alt="`${product.model}`"
           loading="lazy"
           class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
           @error="onImgError" />

      <!-- SVG 程序生成 (无真图时) -->
      <div v-else-if="mainImage?.svg" v-html="mainImage.svg" class="w-full h-full [&>svg]:w-full [&>svg]:h-full" />

      <!-- "Real Photo" 角标 (仅当使用真图时显示) -->
      <span v-if="mainImage?.isReal"
            class="absolute top-2 right-2 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded shadow">
        📷 REAL
      </span>

      <!-- 标签徽章 -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span v-if="product.tags?.includes('lowCap')"  class="pill-blue">{{ t('product.lowCap') }}</span>
        <span v-if="product.tags?.includes('highSurge')" class="pill-amber">{{ t('product.highSurge') }}</span>
        <span v-if="product.tags?.includes('array')"    class="pill-purple">{{ t('product.array') }}</span>
      </div>

      <!-- 批量选择 checkbox -->
      <div v-if="selectable" class="absolute bottom-2 left-2">
        <input type="checkbox" :checked="selected" @change="$emit('toggle', product.id)"
               class="w-4 h-4 accent-brand-500 cursor-pointer" :aria-label="`select ${product.model}`" />
      </div>

      <!-- 图片数量 -->
      <div class="absolute bottom-1 right-2 text-[10px] text-gray-500 bg-white/80 px-1.5 rounded">
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  product: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false }
})
defineEmits(['toggle'])

const mainImage = computed(() => props.product.images?.[0] || null)

// 真图加载失败时, 回退到 SVG (极少见, 一般是文件丢失或权限问题)
const onImgError = (e) => {
  const img = e.target
  const wrap = img.parentElement
  if (wrap && props.product.images?.[0]?.svg) {
    img.style.display = 'none'
    // 用 v-html 容器替换
    const div = document.createElement('div')
    div.className = 'w-full h-full'
    div.innerHTML = props.product.images[0].svg
    wrap.appendChild(div)
  }
}
</script>

<style scoped>
/* Tailwind 不直接支持 [&>svg] 这种嵌套选择器, 这里用普通方式确保 SVG 填满 */
:deep(svg) { width: 100%; height: 100%; }
</style>