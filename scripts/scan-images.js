/**
 * 扫描真实产品图片, 生成 image-manifest.json
 * ----------------------------------------------------------------------------
 * 用法:
 *   1. 把真实产品照片放进 public/images/products/{SKU}/ 目录
 *      SKU 格式: ESD-{PACKAGE}-{MODEL} 转大写, 例如 ESD-SOD323-SD05
 *   2. 每款产品最多 5 张图, 命名固定:
 *      01-top.jpg     - 俯视外形
 *      02-pinout.jpg  - 引脚 / 实物标识
 *      03-circuit.jpg - 应用电路板照片
 *      04-package.jpg - 卷盘包装
 *      05-spec.jpg    - 数据手册截图 / 示波器波形
 *   3. 运行: npm run scan-images
 *   4. 重新运行: 重新 npm run scan-images (无需重启 dev server, 自动热更新)
 *
 * 支持格式: jpg, jpeg, png, webp, avif
 * 推荐尺寸: 800×600 px 左右 (会保留原比例)
 * ----------------------------------------------------------------------------
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const IMG_DIR = join(ROOT, 'public', 'images', 'products')
const OUT_FILE = join(ROOT, 'src', 'generated', 'image-manifest.json')

const SUPPORTED = /\.(jpe?g|png|webp|avif)$/i
const SLOTS = [
  { file: /^01[-_.]top\./i,       slot: 'topView' },
  { file: /^02[-_.]pinout\./i,    slot: 'pinout' },
  { file: /^03[-_.](circuit|app)\./i, slot: 'appCircuit' },
  { file: /^04[-_.](package|tape|reel)\./i, slot: 'packageTape' },
  { file: /^05[-_.](spec|curve|datasheet)\./i, slot: 'specCurve' }
]

/**
 * 计算 SKU: ESD-{PACKAGE}-{MODEL} 大写, 与 prisma/seed.js 保持一致
 */
function skuOf(pkg, model) {
  return `ESD-${pkg}-${model}`.toUpperCase().replace(/\s+/g, '')
}

/**
 * 递归扫描目录, 提取所有图片文件
 */
async function walk(dir, base = '') {
  let out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (e) {
    if (e.code === 'ENOENT') return []
    throw e
  }
  for (const ent of entries) {
    const full = join(dir, ent.name)
    const rel = base ? `${base}/${ent.name}` : ent.name
    if (ent.isDirectory()) {
      out = out.concat(await walk(full, rel))
    } else if (ent.isFile() && SUPPORTED.test(ent.name)) {
      out.push(rel)
    }
  }
  return out
}

/**
 * 从文件名识别 slot
 */
function matchSlot(filename) {
  for (const { file, slot } of SLOTS) {
    if (file.test(filename)) return slot
  }
  return null
}

/**
 * 主流程
 */
async function main() {
  console.log('🔍 Scanning product images in public/images/products/ ...')

  const manifest = {}
  const stats = { total: 0, withImages: 0, bySlot: { topView: 0, pinout: 0, appCircuit: 0, packageTape: 0, specCurve: 0 } }

  // 1) 列出所有 SKU 目录
  let dirs = []
  try { dirs = await readdir(IMG_DIR) } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('  ⚠️  public/images/products/ not found. Creating empty manifest.')
    } else throw e
  }

  for (const sku of dirs) {
    const skuDir = join(IMG_DIR, sku)
    const s = await stat(skuDir).catch(() => null)
    if (!s?.isDirectory()) continue

    const files = await walk(skuDir)
    if (!files.length) continue

    const slots = {}
    for (const f of files) {
      const slot = matchSlot(f)
      if (!slot) continue
      // 同 slot 多张时取第一张
      if (!slots[slot]) {
        slots[slot] = `/images/products/${sku}/${f.replace(/\\/g, '/')}`
        stats.bySlot[slot]++
      }
    }
    if (Object.keys(slots).length) {
      manifest[sku] = slots
      stats.withImages++
    }
  }

  // 2) 写文件
  await import('node:fs/promises').then(fs => fs.mkdir(dirname(OUT_FILE), { recursive: true }))
  await writeFile(OUT_FILE, JSON.stringify(manifest, null, 2), 'utf8')

  console.log(`✅ Scanned ${stats.total} files`)
  console.log(`📦 ${stats.withImages} products have at least 1 real image`)
  console.log(`🖼  By slot:`)
  for (const [s, n] of Object.entries(stats.bySlot)) console.log(`     ${s.padEnd(12)} ${n}`)
  console.log(`\n💾 Manifest saved to: ${relative(ROOT, OUT_FILE)}`)
  console.log('   (Next: frontend auto-reloads, real images will show instead of SVG placeholders)')
}

main().catch(e => { console.error('❌ Scan failed:', e); process.exit(1) })