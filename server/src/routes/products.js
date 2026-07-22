/**
 * 产品路由 - 列表 / 详情 / 搜索 / 筛选
 */
import { Router } from 'express'
import { prisma } from '../config/db.js'
import { success, paginated, Errors } from '../utils/response.js'
import { authOptional } from '../middlewares/auth.js'

const router = Router()

// ====== GET /api/v1/products ======
// 支持查询参数: q, package, direction, voltage, lowCap, highSurge, page, pageSize, sort, lang
router.get('/', authOptional, async (req, res, next) => {
  try {
    const {
      q,
      package: pkg,           // 封装 (可逗号分隔)
      direction,
      voltage,                // 'low', 'mid', 'high' 或 '0-5' '5-12' 区间
      lowCap,
      highSurge,
      isFeatured,
      page = 1,
      pageSize = 24,
      sort = 'default',
      lang = 'en'
    } = req.query

    const where = { isActive: true }
    const and = []

    if (q) {
      and.push({
        OR: [
          { model: { contains: q } },
          { sku: { contains: q } },
          { translations: { some: { language: lang, name: { contains: q } } } }
        ]
      })
    }
    if (pkg) {
      const list = String(pkg).split(',')
      and.push({ packageType: { in: list } })
    }
    if (direction) {
      const list = String(direction).split(',')
      and.push({ direction: { in: list } })
    }
    if (voltage) {
      // 支持区间: "0-5" "5-12" "12-24" "24-100"
      const ranges = {
        '0-5':   [0, 5],
        '5-12':  [5.01, 12],
        '12-24': [12.01, 24],
        '24-100':[24.01, 1000]
      }
      const r = ranges[voltage]
      if (r) and.push({ vrwmMin: { lte: r[1] }, vrwmMax: { gte: r[0] } })
    }
    if (lowCap === '1' || lowCap === 'true') and.push({ cjValue: { lte: 1 } })
    if (highSurge === '1' || highSurge === 'true') and.push({ ippmValue: { gte: 15 } })
    if (isFeatured === '1' || isFeatured === 'true') and.push({ isFeatured: true })
    if (and.length) where.AND = and

    // 排序
    let orderBy = { createdAt: 'desc' }
    if (sort === 'cap-asc')   orderBy = { cjValue: 'asc' }
    if (sort === 'cap-desc')  orderBy = { cjValue: 'desc' }
    if (sort === 'ippm-desc') orderBy = { ippmValue: 'desc' }
    if (sort === 'price-asc') orderBy = { priceUsd: 'asc' }
    if (sort === 'new')       orderBy = { createdAt: 'desc' }

    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: +pageSize,
        include: {
          translations: { where: { language: lang }, take: 1 },
          images: { take: 1, where: { isPrimary: true }, orderBy: { sortOrder: 'asc' } }
        }
      }),
      prisma.product.count({ where })
    ])

    return paginated(res, list.map(serializeProduct), total, +page, +pageSize)
  } catch (e) {
    next(e)
  }
})

// ====== GET /api/v1/products/filters ======
// 返回可用的筛选条件 (含每项的计数)
router.get('/filters', async (req, res, next) => {
  try {
    const lang = req.query.lang || 'en'
    const all = await prisma.product.findMany({
      where: { isActive: true },
      select: { packageType: true, direction: true, vrwmMin: true, vrwmMax: true, cjValue: true, ippmValue: true }
    })
    const pkgCount = {}
    const dirCount = {}
    let lowCap = 0, highSurge = 0
    for (const p of all) {
      pkgCount[p.packageType] = (pkgCount[p.packageType] || 0) + 1
      dirCount[p.direction]   = (dirCount[p.direction]   || 0) + 1
      if (p.cjValue <= 1) lowCap++
      if (p.ippmValue >= 15) highSurge++
    }
    return success(res, {
      packages: Object.entries(pkgCount).map(([k, v]) => ({ value: k, count: v })),
      directions: Object.entries(dirCount).map(([k, v]) => ({ value: k, count: v })),
      voltageRanges: [
        { value: '0-5',    label: '≤ 5V' },
        { value: '5-12',   label: '5V - 12V' },
        { value: '12-24',  label: '12V - 24V' },
        { value: '24-100', label: '> 24V' }
      ],
      lowCapCount: lowCap,
      highSurgeCount: highSurge
    })
  } catch (e) { next(e) }
})

// ====== GET /api/v1/products/featured ======
// 首页热门产品
router.get('/featured', async (req, res, next) => {
  try {
    const lang = req.query.lang || 'en'
    const list = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { inquiryCount: 'desc' },
      include: {
        translations: { where: { language: lang }, take: 1 },
        images: { take: 1, where: { isPrimary: true } }
      }
    })
    return success(res, list.map(serializeProduct))
  } catch (e) { next(e) }
})

// ====== GET /api/v1/products/:slug ======
// 产品详情
router.get('/:slug', authOptional, async (req, res, next) => {
  try {
    const lang = req.query.lang || 'en'
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        translations: { where: { language: lang } },
        images: { orderBy: { sortOrder: 'asc' } },
        priceBreaks: { orderBy: { minQty: 'asc' } },
        category: { include: { translations: { where: { language: lang } } } }
      }
    })
    if (!product) return next(Errors.notFound('Product not found'))

    // 增加浏览数
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    }).catch(() => {}) // 不阻塞响应

    return success(res, serializeProduct(product, true))
  } catch (e) { next(e) }
})

// ====== GET /api/v1/products/:id/related ======
// 关联产品 (同封装 / 同电压)
router.get('/:id/related', async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({ where: { id: +id } })
    if (!product) return next(Errors.notFound('Product not found'))

    const lang = req.query.lang || 'en'
    const [samePackage, sameVoltage] = await Promise.all([
      prisma.product.findMany({
        where: { packageType: product.packageType, isActive: true, id: { not: product.id } },
        take: 6,
        include: { translations: { where: { language: lang }, take: 1 } }
      }),
      prisma.product.findMany({
        where: {
          vrwmMin: product.vrwmMin,
          isActive: true,
          id: { not: product.id }
        },
        take: 6,
        include: { translations: { where: { language: lang }, take: 1 } }
      })
    ])
    return success(res, {
      samePackage: samePackage.map(serializeProduct),
      sameVoltage: sameVoltage.map(serializeProduct)
    })
  } catch (e) { next(e) }
})

// ====== 工具: 序列化产品 ======
function serializeProduct(p, includeAll = false) {
  const base = {
    id: p.id,
    sku: p.sku,
    model: p.model,
    slug: p.slug,
    package: p.packageType,
    direction: p.direction,
    vrwm: p.vrwm,
    vrwmMin: Number(p.vrwmMin),
    vrwmMax: Number(p.vrwmMax),
    cj: p.cjDisplay,
    cjValue: Number(p.cjValue),
    ippm: p.ippmDisplay,
    ippmValue: Number(p.ippmValue),
    packageQty: p.packageQty,
    moq: p.moq,
    leadTimeDays: p.leadTimeDays,
    stockQty: p.stockQty,
    priceUsd: Number(p.priceUsd),
    rohsCompliant: p.rohsCompliant,
    reachCompliant: p.reachCompliant,
    isFeatured: p.isFeatured,
    viewCount: p.viewCount,
    inquiryCount: p.inquiryCount,
    translation: p.translations?.[0] || null,
    primaryImage: p.images?.find(i => i.isPrimary)?.url || p.images?.[0]?.url || null,
    images: p.images?.map(i => ({ type: i.imageType, url: i.url, alt: i.altText })) || []
  }
  if (includeAll) {
    base.priceBreaks = p.priceBreaks?.map(pb => ({
      minQty: pb.minQty, maxQty: pb.maxQty, priceUsd: Number(pb.priceUsd)
    })) || []
    base.datasheetUrl = p.datasheetUrl
    base.category = p.category
  }
  return base
}

export default router
