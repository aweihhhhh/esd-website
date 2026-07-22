/**
 * 产品图片管理 (v3 - 真实图片优先 + SVG 回退)
 * ----------------------------------------------------------------------------
 * 优先级:
 *   1. 真实图片 (src/generated/image-manifest.json 中登记的)
 *   2. SVG 程序化示意图 (utils/svgGenerator.js 生成的 data URI)
 *
 * 真实图片存放: public/images/products/{SKU}/{01-top,02-pinout,...}.jpg
 * 用法: 把照片放进去后运行 npm run scan-images, 前端自动刷新
 * ----------------------------------------------------------------------------
 */
import { products } from './products.js'
import { generateAllImages, toDataURI } from '@/utils/svgGenerator.js'

// ============= 加载真实图片清单 =============
// 该文件由 scripts/scan-images.js 生成, 缺失则视为空 (全部用 SVG)
import imageManifest from '@/generated/image-manifest.json'

/**
 * 计算 SKU (与后端 prisma/seed.js 保持一致)
 * 格式: ESD-{PACKAGE}-{MODEL} 大写
 */
function skuOf(product) {
  return `ESD-${product.package}-${product.model}`.toUpperCase().replace(/\s+/g, '')
}

// ============= 生成 / 缓存 =============
// 缓存 key 包含版本号, 升级 svgGenerator 后自动失效
const IMAGE_VERSION = 'v3'
const svgCache = new Map()

function getSvgImages(product) {
  const cacheKey = `${IMAGE_VERSION}:svg:${product.id}`
  if (svgCache.has(cacheKey)) return svgCache.get(cacheKey)
  const list = generateAllImages(product).map(img => ({
    type: img.type,
    label: img.label,
    svg: img.svg,
    dataUri: toDataURI(img.svg),
    isReal: false   // 标记为 SVG
  }))
  svgCache.set(cacheKey, list)
  return list
}

const realCache = new Map()
function getRealImages(product) {
  const sku = skuOf(product)
  const real = imageManifest[sku]
  if (!real || !Object.keys(real).length) return null
  const cacheKey = `${IMAGE_VERSION}:real:${sku}`
  if (realCache.has(cacheKey)) return realCache.get(cacheKey)
  // 按 type 顺序: topView, pinout, appCircuit, packageTape, specCurve
  const order = ['topView', 'pinout', 'appCircuit', 'packageTape', 'specCurve']
  const list = []
  for (const type of order) {
    if (real[type]) {
      list.push({
        type,
        label: typeLabel(type),
        url: real[type],         // 真实图片 URL
        dataUri: real[type],     // 用 url 字段即可, dataUri 兼容旧代码
        svg: null,
        isReal: true             // 标记为真实图片
      })
    }
  }
  realCache.set(cacheKey, list)
  return list
}

function typeLabel(type) {
  return ({
    topView: 'Top View',
    pinout: 'Pinout',
    appCircuit: 'Application Circuit',
    packageTape: 'Package & Reel',
    specCurve: 'Spec Curve'
  })[type] || type
}

/**
 * 主入口: 给一个产品返回图片列表
 * - 有真图就用真图 (按 manifest 顺序)
 * - 没真图或某 slot 缺失, 用 SVG 补齐
 * - 保证返回 5 个 slot, 顺序固定
 */
function getProductImageList(product) {
  const real = getRealImages(product) || []
  const svg = getSvgImages(product)
  // 按 slot 合并
  const order = ['topView', 'pinout', 'appCircuit', 'packageTape', 'specCurve']
  const result = []
  for (const type of order) {
    const r = real.find(x => x.type === type)
    if (r) {
      result.push(r)
    } else {
      const s = svg.find(x => x.type === type)
      result.push(s)
    }
  }
  return result
}

// 给 products 数组的每个元素加 images 字段
products.forEach(p => {
  p.images = getProductImageList(p)
})

// ============= 工具函数 =============
export function getProductImages(productId) {
  const p = products.find(x => x.id === productId)
  return p ? p.images : []
}

export function getProductMainImage(productId) {
  const imgs = getProductImages(productId)
  return imgs.length ? imgs[0] : null
}

/**
 * 统计生成的图片总数
 */
export const IMAGE_STATS = {
  productCount: products.length,
  realImagesCount: Object.values(imageManifest).reduce((sum, slots) => sum + Object.keys(slots).length, 0),
  svgImagesCount: products.length * 5,
  manifestKeys: Object.keys(imageManifest).length,
  generatedAt: new Date().toISOString()
}