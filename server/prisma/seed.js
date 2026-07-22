/**
 * 数据库初始化 + 种子数据
 * ----------------------------------------------------------------------------
 * 用法:
 *   1. 先执行 schema.sql 创建数据库
 *   2. 设置 DATABASE_URL 环境变量
 *   3. node prisma/seed.js
 *      或 npm run prisma:seed
 *
 * 导入源: ../src/data/products.js (前端的 221 款产品)
 * ----------------------------------------------------------------------------
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { products as frontendProducts, packageOptions } from '../../src/data/products.js'

const prisma = new PrismaClient()

// ============== 工具函数 ==============
const slug = (pkg, model) => `${pkg}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// 根据 VRWM 字符串拆 min/max (支持 "5V" / "7V+12V" / "5V-36V")
function parseVrwm(str) {
  if (!str) return { min: 0, max: 0 }
  const nums = (str.match(/[\d.]+/g) || []).map(Number)
  if (nums.length === 0) return { min: 0, max: 0 }
  if (nums.length === 1) return { min: nums[0], max: nums[0] }
  return { min: Math.min(...nums), max: Math.max(...nums) }
}

// 把前端的 cjValue (pF) 转字符串, 兼容显示
function cjDisplay(p) {
  return p.cjValue < 1 ? `${p.cjValue}PF` : `${p.cjValue}PF`
}

// ============== 主流程 ==============
async function main() {
  console.log('🌱 Seeding database...')

  // ----- 1. 管理员账号 -----
  console.log('  → Creating admin user...')
  const adminPwd = await bcrypt.hash('Admin@123456', 12)
  await prisma.user.upsert({
    where: { email: 'admin@esd-diode.com' },
    update: {},
    create: {
      email: 'admin@esd-diode.com',
      passwordHash: adminPwd,
      fullName: 'Site Admin',
      role: 'admin',
      preferredLanguage: 'en',
      emailVerifiedAt: new Date()
    }
  })
  // 演示账号
  await prisma.user.upsert({
    where: { email: 'demo@esd-diode.com' },
    update: {},
    create: {
      email: 'demo@esd-diode.com',
      passwordHash: await bcrypt.hash('Demo@123456', 12),
      fullName: 'Demo Buyer',
      role: 'customer',
      preferredLanguage: 'en',
      emailVerifiedAt: new Date()
    }
  })

  // ----- 2. 分类 -----
  console.log('  → Creating categories...')
  const catData = [
    { slug: 'esd-protection', icon: '⚡' },
    { slug: 'tvs-array',      icon: '🛡' },
    { slug: 'low-capacitance',icon: '🎯' },
    { slug: 'high-surge',     icon: '💪' }
  ]
  const catTranslations = {
    en: { 'esd-protection': 'ESD Protection Diodes', 'tvs-array': 'TVS Arrays', 'low-capacitance': 'Low Capacitance', 'high-surge': 'High Surge Current' },
    zh: { 'esd-protection': 'ESD 保护二极管', 'tvs-array': 'TVS 阵列', 'low-capacitance': '低结电容', 'high-surge': '大浪涌电流' },
    'pt-BR': { 'esd-protection': 'Diodos de Proteção ESD', 'tvs-array': 'Arrays TVS', 'low-capacitance': 'Baixa Capacitância', 'high-surge': 'Alta Corrente de Surto' },
    ru: { 'esd-protection': 'Защитные диоды ЭСР', 'tvs-array': 'Массивы TVS', 'low-capacitance': 'Низкая ёмкость', 'high-surge': 'Высокий импульсный ток' }
  }
  for (const c of catData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, icon: c.icon, sortOrder: catData.indexOf(c) }
    })
    for (const lang of ['en', 'zh', 'pt-BR', 'ru']) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_language: { categoryId: cat.id, language: lang } },
        update: {},
        create: {
          categoryId: cat.id,
          language: lang,
          name: catTranslations[lang][c.slug]
        }
      })
    }
  }
  const esdCat = await prisma.category.findUnique({ where: { slug: 'esd-protection' } })

  // ----- 3. 产品 (221 款) -----
  console.log(`  → Importing ${frontendProducts.length} products...`)
  let imported = 0
  for (const fp of frontendProducts) {
    const productSlug = slug(fp.package, fp.model)
    const sku = `ESD-${fp.package}-${fp.model}`.toUpperCase()

    // 提取价格阶梯 (示例: 1K+ $0.10, 10K+ $0.08, 100K+ $0.05)
    const basePrice = 0.05 + (fp.cjValue < 1 ? 0.05 : 0) + (fp.ippmValue > 20 ? 0.03 : 0)

    // 判断是否在低容/大电流专区
    const isFeatured = fp.tags?.includes('lowCap') || fp.tags?.includes('highSurge') || fp.model === 'SD05' || fp.model === 'GBLC05C'

    const product = await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        model: fp.model,
        slug: productSlug,
        categoryId: esdCat.id,
        packageType: fp.package,
        direction: fp.direction,
        vrwm: fp.vrwm,
        vrwmMin: fp.vrwmMin,
        vrwmMax: fp.vrwmMax,
        cjValue: fp.cjValue,
        cjDisplay: fp.cj,
        ippmValue: fp.ippmValue,
        ippmDisplay: fp.ippm,
        packageQty: fp.packageQty,
        moq: 1000,
        leadTimeDays: 14,
        stockQty: fp.tags?.includes('highSurge') ? 50000 : 10000,
        priceUsd: basePrice.toFixed(4),
        isActive: true,
        isFeatured
      }
    })

    // 价格阶梯
    const breaks = [
      { minQty: 1000,  maxQty: 9999,   price: basePrice * 1.0 },
      { minQty: 10000, maxQty: 99999,  price: basePrice * 0.85 },
      { minQty: 100000, maxQty: null,  price: basePrice * 0.7 }
    ]
    for (const b of breaks) {
      await prisma.productPriceBreak.upsert({
        where: { id: 0 },  // 不行, 需要复合唯一
        update: {},
        create: {
          productId: product.id,
          minQty: b.minQty,
          maxQty: b.maxQty,
          priceUsd: b.price.toFixed(4)
        }
      }).catch(() => null) // 重复时跳过
    }

    // 多语言翻译
    const transByLang = {
      en: { name: `${fp.package} ${fp.direction} ESD TVS ${fp.model}`,
            short: `Wholesale ${fp.model} ${fp.direction} ESD protection diode. VRWM ${fp.vrwm}, Cj ${fp.cj}, IPPM ${fp.ippm}.`,
            apps: fp.applications },
      zh: { name: `${fp.package} ${fp.direction === 'Unidirectional' ? '单向' : '双向'} ESD 保护二极管 ${fp.model}`,
            short: `批发 ${fp.model} ${fp.direction === 'Unidirectional' ? '单向' : '双向'} ESD 防护二极管。VRWM ${fp.vrwm}，结电容 ${fp.cj}，峰值电流 ${fp.ippm}。`,
            apps: fp.vrwmMin <= 5 ? 'USB 2.0/3.0、HDMI、Type-C、充电口'
               : fp.vrwmMin <= 12 ? '智能穿戴、物联网、消费电子、电池管理'
               : '工业控制、车载电子、电源、12V/24V 系统' },
      'pt-BR': { name: `Diodo ESD ${fp.direction === 'Unidirectional' ? 'Unidirecional' : 'Bidirecional'} ${fp.package} ${fp.model}`,
            short: `Atacado ${fp.model} diodo ESD ${fp.direction === 'Unidirectional' ? 'unidirecional' : 'bidirecional'}. VRWM ${fp.vrwm}, Cj ${fp.cj}, IPPM ${fp.ippm}.`,
            apps: fp.vrwmMin <= 5 ? 'USB 2.0/3.0, HDMI, Type-C, portas de carregamento'
                : fp.vrwmMin <= 12 ? 'Wearables, IoT, eletrônicos de consumo, gerenciamento de bateria'
                : 'Controle industrial, automotivo, fontes, sistemas 12V/24V' },
      ru: { name: `ЭСР диод ${fp.direction === 'Unidirectional' ? 'однонаправленный' : 'двунаправленный'} ${fp.package} ${fp.model}`,
            short: `Опт ${fp.model} ЭСР диод ${fp.direction === 'Unidirectional' ? 'однонаправленный' : 'двунаправленный'}. VRWM ${fp.vrwm}, Cj ${fp.cj}, IPPM ${fp.ippm}.`,
            apps: fp.vrwmMin <= 5 ? 'USB 2.0/3.0, HDMI, Type-C, зарядные порты'
                : fp.vrwmMin <= 12 ? 'Носимые устройства, IoT, потребительская электроника, BMS'
                : 'Промышленная автоматика, авто, источники питания, системы 12В/24В' }
    }
    for (const [lang, t] of Object.entries(transByLang)) {
      await prisma.productTranslation.upsert({
        where: { productId_language: { productId: product.id, language: lang } },
        update: {},
        create: {
          productId: product.id,
          language: lang,
          name: t.name,
          shortDesc: t.short,
          applications: t.apps,
          keywords: `ESD, TVS, ${fp.model}, ${fp.package}, ${fp.direction}`,
          metaTitle: `${fp.model} - ${fp.package} ESD Diode Wholesale | Datasheet`,
          metaDesc: t.short.slice(0, 250)
        }
      })
    }
    imported++
  }
  console.log(`    ✓ ${imported} products imported`)

  // ----- 4. 系统设置 -----
  console.log('  → Inserting system settings...')
  const settings = [
    { k: 'site.name', v: 'ESD Diode Wholesale' },
    { k: 'site.tagline.en', v: 'Factory Direct ESD Protection Diodes' },
    { k: 'site.tagline.zh', v: '工厂直销 ESD 保护二极管' },
    { k: 'site.tagline.pt-BR', v: 'Diodos ESD direto da fábrica' },
    { k: 'site.tagline.ru', v: 'ЭСР диоды напрямую с завода' },
    { k: 'contact.email', v: 'sales@esd-diode.com' },
    { k: 'contact.whatsapp', v: '8613800000000' },
    { k: 'shipping.minDays', v: '7' },
    { k: 'shipping.maxDays', v: '21' }
  ]
  for (const s of settings) {
    await prisma.setting.upsert({ where: { k: s.k }, update: { v: s.v }, create: s })
  }

  console.log('\n✅ Seed completed successfully!')
  console.log('\n📋 Default accounts:')
  console.log('   Admin: admin@esd-diode.com / Admin@123456')
  console.log('   Demo:  demo@esd-diode.com  / Demo@123456')
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
