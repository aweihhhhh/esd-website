/**
 * 批量图片下载器 (v1)
 * ----------------------------------------------------------------------------
 * 支持 3 种来源 (任选 1 或组合使用):
 *
 *   A. CSV 模式 - 从 Excel/CSV 导入图片 URL (推荐, 最稳定)
 *      用户从供应商网站复制图片 URL 到 images.csv, 一行一条
 *
 *   B. LCSC 模式 - 用 LCSC 公开搜索 (需要用户登录后提供 cookie)
 *      浏览器 DevTools → Network → 任意请求 → 复制 Cookie 头
 *
 *   C. 通用 URL 模板 - 直接拼 URL (用户知道供应商图片 URL 规则时用)
 *
 * 用法:
 *   1. 准备数据 (任选):
 *      - images.csv: sku,slot,url 三列
 *      - 或环境变量: LCSC_COOKIE="lcsc_user=xxx;..."
 *   2. 运行: npm run scrape-images
 *   3. 运行: npm run scan-images (生成前端用的 manifest)
 *
 * 输出: 直接放到 public/images/products/{SKU}/{slot}.jpg
 * ----------------------------------------------------------------------------
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'images', 'products')

const SLOTS = ['01-top', '02-pinout', '03-circuit', '04-package', '05-spec']

// ============= 通用 fetch (带超时和重试) =============
async function fetchWithRetry(url, opts = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    } catch (e) {
      if (i === retries - 1) throw e
      console.log(`   ⚠️  Retry ${i + 1}/${retries} (${e.message})`)
      await new Promise(r => setTimeout(r, 1500 * (i + 1)))
    }
  }
}

// ============= 保存图片 =============
async function saveImage(url, sku, slot, ext) {
  const skuDir = join(OUT_DIR, sku)
  await mkdir(skuDir, { recursive: true })
  const file = join(skuDir, `${slot}.${ext}`)
  const res = await fetchWithRetry(url)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(file, buf)
  return { size: buf.length, path: file }
}

// ============= 探测扩展名 =============
function detectExt(url, contentType) {
  if (contentType) {
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg'
    if (contentType.includes('png')) return 'png'
    if (contentType.includes('webp')) return 'webp'
    if (contentType.includes('avif')) return 'avif'
  }
  const m = url.match(/\.(jpe?g|png|webp|avif)(\?|$)/i)
  if (m) return m[1].toLowerCase().replace('jpeg', 'jpg')
  return 'jpg' // 默认
}

// ============= 模式 A: CSV 导入 (推荐) =============
/**
 * CSV 格式:
 *   sku,slot,url
 *   ESD-SOD323-SD05,01-top,https://example.com/sd05-top.jpg
 *   ESD-SOD323-SD05,02-pinout,https://example.com/sd05-pinout.jpg
 *   ...
 *
 * 用户可以从:
 *   - LCSC 商品页右键查看图片 → 复制图片地址
 *   - Mouser/Digi-Key 同上
 *   - 数据手册 PDF 截图后上传到图床, 拿 URL
 *   - 工厂直接提供的图片 URL
 */
async function importFromCsv(file = 'images.csv') {
  const path = join(ROOT, file)
  let text
  try {
    text = await readFile(path, 'utf8')
  } catch (e) {
    console.log(`📄 CSV file ${file} not found, skipping CSV mode.`)
    return 0
  }

  // 简易 CSV 解析 (支持引号字段)
  const rows = text.split(/\r?\n/).filter(l => l.trim()).map(line => {
    const m = line.match(/^"?([^",]*)"?,\s*"?([^",]*)"?,\s*"?([^"]*)"?$/)
    return m ? [m[1], m[2], m[3]] : line.split(',')
  }).filter(r => r.length >= 3 && r[0] && r[1] && r[2])

  // 跳过表头
  const data = rows[0]?.[0]?.toLowerCase() === 'sku' ? rows.slice(1) : rows
  console.log(`📄 CSV: ${data.length} entries found in ${file}`)

  let ok = 0, fail = 0
  for (const [sku, slot, url] of data) {
    const cleanSlot = slot.trim()
    if (!SLOTS.includes(cleanSlot)) {
      console.log(`   ⚠️  Invalid slot: ${cleanSlot} for ${sku}`)
      fail++; continue
    }
    try {
      // 先 HEAD 探测
      const head = await fetchWithRetry(url, { method: 'HEAD' }).catch(() => null)
      const ct = head?.headers.get('content-type') || ''
      const ext = detectExt(url, ct)
      const { size } = await saveImage(url, sku.trim(), cleanSlot, ext)
      console.log(`   ✓ ${sku}/${cleanSlot}.${ext} (${(size/1024).toFixed(1)}KB)`)
      ok++
    } catch (e) {
      console.log(`   ✗ ${sku}/${cleanSlot}: ${e.message}`)
      fail++
    }
    await new Promise(r => setTimeout(r, 300))  // 礼貌限速
  }
  console.log(`📄 CSV: ${ok} ok, ${fail} failed`)
  return ok
}

// ============= 模式 B: LCSC 公开搜索 (用 cookie) =============
/**
 * 需要:
 *   1. 用户在浏览器登录 lcsc.com
 *   2. DevTools → Network → 任意 search 请求
 *   3. 复制完整 Cookie 头
 *   4. 设置环境变量: export LCSC_COOKIE="lcsc_user=xxx;..."
 *
 * 或者提供完整 headers 文件: lcsc-headers.json
 *   { "cookie": "...", "user-agent": "...", "authorization": "..." }
 */
async function importFromLcsc(products, limit = 5) {
  const cookie = process.env.LCSC_COOKIE
  if (!cookie) {
    console.log('🌐 LCSC mode: skipped (no LCSC_COOKIE env var)')
    console.log('   Usage: export LCSC_COOKIE="lcsc_user=xxx;..."')
    return 0
  }

  console.log(`🌐 LCSC mode: scraping ${Math.min(limit, products.length)} products`)
  let ok = 0
  for (const p of products.slice(0, limit)) {
    const sku = `ESD-${p.package}-${p.model}`.toUpperCase().replace(/\s+/g, '')
    try {
      // LCSC 搜索 API (需要正确的 header)
      const url = `https://www.lcsc.com/api/so/search?keyword=${encodeURIComponent(p.model)}&pageSize=5`
      const res = await fetchWithRetry(url, {
        headers: {
          'cookie': cookie,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'accept': 'application/json'
        }
      })
      const json = await res.json()
      const item = json?.data?.searchResult?.[0] || json?.data?.list?.[0] || json?.data?.[0]
      if (!item?.productImage) {
        console.log(`   ⚠️  ${p.model}: no image found`)
        continue
      }
      const imageUrl = item.productImage.startsWith('http')
        ? item.productImage
        : `https://www.lcsc.com${item.productImage}`

      const head = await fetchWithRetry(imageUrl, {
        headers: { 'cookie': cookie, 'user-agent': 'Mozilla/5.0', 'referer': 'https://www.lcsc.com/' }
      })
      const ext = detectExt(imageUrl, head.headers.get('content-type'))
      await saveImage(imageUrl, sku, '01-top', ext)
      console.log(`   ✓ ${sku}: ${item.productCode || item.productId || 'ok'}`)
      ok++
    } catch (e) {
      console.log(`   ✗ ${p.model}: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 1500))  // LCSC 限速
  }
  console.log(`🌐 LCSC: ${ok} downloaded`)
  return ok
}

// ============= 模式 C: URL 模板 =============
/**
 * 当用户知道某供应商的图片 URL 规则时, 拼 URL 批量下载
 * 例如: https://example.com/products/{model}.jpg
 *
 * 配置 via URL_TEMPLATE 环境变量:
 *   export URL_TEMPLATE="https://mysupplier.com/img/{model}/top.jpg"
 *   npm run scrape-images
 */
async function importFromTemplate(products) {
  const tmpl = process.env.URL_TEMPLATE
  if (!tmpl) {
    console.log('🔧 Template mode: skipped (no URL_TEMPLATE env var)')
    return 0
  }

  console.log(`🔧 Template mode: ${tmpl}`)
  let ok = 0
  for (const p of products) {
    const sku = `ESD-${p.package}-${p.model}`.toUpperCase().replace(/\s+/g, '')
    for (const slot of SLOTS) {
      const url = tmpl
        .replace('{sku}', sku)
        .replace('{package}', p.package)
        .replace('{model}', p.model)
        .replace('{slot}', slot)
      try {
        const head = await fetchWithRetry(url, { method: 'HEAD' })
        const ext = detectExt(url, head.headers.get('content-type'))
        await saveImage(url, sku, slot, ext)
        ok++
      } catch (e) { /* skip */ }
    }
    await new Promise(r => setTimeout(r, 200))
  }
  console.log(`🔧 Template: ${ok} downloaded`)
  return ok
}

// ============= 入口 =============
async function main() {
  console.log('🚀 ESD Image Bulk Scraper\n')
  // 动态导入产品列表
  const productsMod = await import('../src/data/products.js')
  const products = productsMod.products

  const total = await importFromCsv() + await importFromLcsc(products) + await importFromTemplate(products)

  console.log(`\n${total > 0 ? '✅' : '⚠️'} Total: ${total} images downloaded`)
  if (total > 0) {
    console.log('   Next: npm run scan-images')
  }
}

main().catch(e => { console.error('❌', e); process.exit(1) })