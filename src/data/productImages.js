/**
 * 产品图片数据
 * ----------------------------------------------------------------------------
 * 为 221 款 ESD 防护二极管自动生成 5 张 SVG 工业风示意图:
 *   1. topView      - 产品俯视外形（按封装尺寸比例）
 *   2. pinout       - 引脚定义
 *   3. appCircuit   - 典型应用电路
 *   4. packageTape  - SMD 卷盘包装
 *   5. specCurve    - 电气特性曲线
 *
 * 使用方法: 在 product 对象上读 `product.images` 即可获得 5 个图
 * ----------------------------------------------------------------------------
 */
import { products } from './products.js'
import { generateAllImages, toDataURI } from '@/utils/svgGenerator.js'

// ============= 一次性给所有产品附加 images =============
const cache = new Map()
function attachImages(product) {
  if (cache.has(product.id)) return cache.get(product.id)
  const list = generateAllImages(product).map(img => ({
    type: img.type,
    label: img.label,
    // 同时存 SVG 字符串和 data URI (data URI 用于 <img src>, 字符串用于 v-html)
    dataUri: toDataURI(img.svg),
    svg: img.svg
  }))
  cache.set(product.id, list)
  return list
}

// 给 products 数组的每个元素加 images 字段
products.forEach(p => {
  p.images = attachImages(p)
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
 * 221 款产品 × 5 张 = 1105 张 SVG
 */
export const IMAGE_STATS = {
  productCount: products.length,
  imagesPerProduct: 5,
  totalImages: products.length * 5,
  generatedAt: new Date().toISOString()
}
