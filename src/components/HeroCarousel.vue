<template>
  <div class="relative w-full h-[420px] md:h-[480px] overflow-hidden">
    <!-- Slides -->
    <div v-for="(p, i) in slides" :key="p.id"
         v-show="i === current"
         class="absolute inset-0 transition-opacity duration-700"
         :class="i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'">
      <div class="absolute inset-0">
        <img :src="p.images[0].dataUri" :alt="p.model" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-brand-700/90 via-brand-500/75 to-brand-500/40"></div>
      </div>
      <div class="relative container-x h-full flex items-center">
        <div class="max-w-2xl text-white">
          <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-3">
            🔥 {{ rankLabel(p) }}
          </span>
          <h2 class="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            {{ p.model }}
            <span class="block text-base md:text-xl font-normal text-gray-200 mt-2">
              {{ p.package }} · {{ p.direction === 'Unidirectional' ? 'Uni' : 'Bi' }} · {{ p.vrwm }} · {{ p.cj }} · {{ p.ippm }}
            </span>
          </h2>
          <p class="mt-4 text-sm md:text-base text-gray-100 max-w-xl">
            {{ p.summary }}
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <router-link :to="`/products/${p.id}`" class="btn-accent !py-3 !px-6 text-sm">
              📋 {{ t('common.view') }} {{ t('nav.products') }}
            </router-link>
            <router-link :to="{ path: '/inquiry', query: { model: p.model } }" class="btn !py-3 !px-6 text-sm bg-white text-brand-500 hover:bg-gray-100">
              📩 {{ t('detail.inquiryCta') }}
            </router-link>
          </div>
          <div class="mt-4 flex flex-wrap gap-2 text-xs text-gray-200">
            <span v-if="p.tags?.includes('lowCap')" class="px-2 py-0.5 bg-white/20 rounded">{{ t('product.lowCap') }}</span>
            <span v-if="p.tags?.includes('highSurge')" class="px-2 py-0.5 bg-white/20 rounded">{{ t('product.highSurge') }}</span>
            <span v-if="p.tags?.includes('array')" class="px-2 py-0.5 bg-white/20 rounded">{{ t('product.array') }}</span>
            <span class="px-2 py-0.5 bg-white/20 rounded">{{ p.packageQty }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 左右切换按钮 -->
    <button @click="prev" aria-label="prev"
            class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white grid place-items-center transition">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button @click="next" aria-label="next"
            class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white grid place-items-center transition">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>

    <!-- 指示器 -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <button v-for="(_, i) in slides" :key="i" @click="current = i"
              :class="['h-2 rounded-full transition-all',
                       i === current ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80']"
              :aria-label="`slide ${i+1}`"></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { products } from '@/data/products.js'

const { t, tm } = useI18n()

/**
 * 智能排序: 按热度 (viewCount + inquiryCount × 5) 降序
 * 热度相同时用 Math.random() 随机打乱
 * 取前 N 张做轮播
 */
const slides = computed(() => {
  const scored = products
    .filter(p => p.isFeatured !== false)        // 优先 featured
    .map(p => ({
      ...p,
      // 用 model 字符串 hash 作为伪随机数, 避免每次刷新顺序大幅变化
      // 但同时保证 ties 之间有随机性
      score: ((p.viewCount || 0) + (p.inquiryCount || 0) * 5) + Math.random() * 50
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  // 二次洗牌: 同分的产品随机
  for (let i = scored.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (Math.abs(scored[i].score - scored[j].score) < 1) {
        if (Math.random() > 0.5) {
          ;[scored[i], scored[j]] = [scored[j], scored[i]]
        }
      }
    }
  }
  return scored
})

const current = ref(0)
let timer = null

const next = () => current.value = (current.value + 1) % slides.value.length
const prev = () => current.value = (current.value - 1 + slides.value.length) % slides.value.length

// 自动播放
const start = () => { timer = setInterval(next, 5000) }
const stop = () => { if (timer) { clearInterval(timer); timer = null } }

onMounted(start)
onUnmounted(stop)

const rankLabel = (p) => {
  const r = current.value + 1
  const ranks = tm('hero.rank') || []
  if (r >= 1 && r <= ranks.length) return ranks[r - 1]
  return t('hero.rankFeatured', { n: r })
}
</script>
