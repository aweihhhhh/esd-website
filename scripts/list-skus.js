/**
 * 生成 SKU 清单 (便于批量操作)
 * ----------------------------------------------------------------------------
 * 用法: node scripts/list-skus.js > sku-list.txt
 * 输出格式: SKU\tPackage\tModel
 * ----------------------------------------------------------------------------
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRODUCTS_FILE = join(__dirname, '..', 'src', 'data', 'products.js')

// 把 ESM 文件转成可 eval 的 CJS 形式 (去掉 import/export)
// 然后用 Function 构造器安全执行
const code = readFileSync(PRODUCTS_FILE, 'utf8')
// 去掉 import 行, 把所有 export 转为 return
const stripped = code
  .replace(/^import\s.+?$/gm, '')
  .replace(/^export\s+const\s+/gm, 'const ')
  .replace(/^export\s+default\s+/gm, '')
  .replace(/^export\s+/gm, '')

const fn = new Function(stripped + '; return { products, packageOptions, directionOptions, voltageBuckets };')
const { products } = fn()

console.log('SKU\tPackage\tModel\tDirection\tVRWM\tCJ\tIPPM')
for (const p of products) {
  const sku = `ESD-${p.package}-${p.model}`.toUpperCase().replace(/\s+/g, '')
  console.log(`${sku}\t${p.package}\t${p.model}\t${p.direction}\t${p.vrwm}\t${p.cj}\t${p.ippm}`)
}

console.error(`\n✅ Found ${products.length} products.`)
console.error('   Pipe to file: node scripts/list-skus.js > sku-list.txt')
console.error('   Open in Excel for batch editing.')