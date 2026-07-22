/**
 * 分类路由
 */
import { Router } from 'express'
import { prisma } from '../config/db.js'
import { success } from '../utils/response.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const lang = req.query.lang || 'en'
    const list = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: { where: { language: lang } },
        _count: { select: { products: true } }
      }
    })
    return success(res, list.map(c => ({
      id: c.id,
      slug: c.slug,
      icon: c.icon,
      productCount: c._count.products,
      name: c.translations[0]?.name || c.slug,
      description: c.translations[0]?.description
    })))
  } catch (e) { next(e) }
})

export default router
