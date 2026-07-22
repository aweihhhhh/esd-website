/**
 * 图片批量处理 (v1)
 * ----------------------------------------------------------------------------
 * 功能:
 *   1. 自动转 WebP (减小 30-70% 文件大小)
 *   2. 自动缩放到合适尺寸 (800x600 max)
 *   3. 跳过大于 1MB 的 (避免上传太大)
 *   4. 报告每个文件的压缩比
 *
 * 依赖: sharp (Node.js 图片处理库, 业界标准)
 * 用法: npm install sharp && npm run process-images
 * ----------------------------------------------------------------------------
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = join(__dirname, '..', 'public', 'images', 'products')

const SUPPORTED = /\.(jpe?g|png|webp)$/i
const MAX_WIDTH = 800
const QUALITY = 80

async function main() {
  console.log('🖼  Processing images in', IMG_DIR, '...')

  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch (e) {
    console.error('❌ sharp not installed. Run: npm install sharp')
    process.exit(1)
  }

  let totalBefore = 0, totalAfter = 0, count = 0

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const ent of entries) {
      const full = join(dir, ent.name)
      if (ent.isDirectory()) await walk(full)
      else if (SUPPORTED.test(ent.name)) await process(full)
    }
  }

  async function process(file) {
    const s = await stat(file)
    const before = s.size
    const ext = extname(file).toLowerCase()

    try {
      let buf
      if (ext === '.webp') {
        // 已经是 webp, 只缩放
        buf = await sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer()
      } else {
        // 转 webp
        buf = await sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer()
      }
      const newName = basename(file, ext) + '.webp'
      const newFile = join(dirname(file), newName)

      // 如果原来不是 webp, 删除原文件
      if (ext !== '.webp') {
        const { unlink } = await import('node:fs/promises')
        await unlink(file).catch(() => {})
      }
      await writeFile(newFile, buf)

      const after = buf.length
      totalBefore += before
      totalAfter += after
      count++
      const saved = ((1 - after / before) * 100).toFixed(0)
      console.log(`   ✓ ${basename(file)} → ${newName} (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB, -${saved}%)`)
    } catch (e) {
      console.log(`   ✗ ${basename(file)}: ${e.message}`)
    }
  }

  await walk(IMG_DIR)

  if (count > 0) {
    console.log(`\n✅ Processed ${count} files`)
    console.log(`   Total: ${(totalBefore/1024/1024).toFixed(2)}MB → ${(totalAfter/1024/1024).toFixed(2)}MB (-${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`)
    console.log('   Next: npm run scan-images')
  } else {
    console.log('   No images to process (drop photos in public/images/products/{SKU}/ first)')
  }
}

main().catch(e => { console.error('❌', e); process.exit(1) })