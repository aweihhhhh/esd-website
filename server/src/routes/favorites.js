/**
 * 收藏 / 对比 路由
 */
import { Router } from 'express'
import { prisma } from '../config/db.js'
import { success } from '../utils/response.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()
router.use(authRequired)

// ====== GET /api/v1/favorites ======
router.get('/', async (req, res, next) => {
  try {
    const list = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { product: { include: { translations: { take: 1 } } } }
    })
    return success(res, list.map(f => f.product))
  } catch (e) { next(e) }
})

// ====== POST /api/v1/favorites/:productId ======
router.post('/:productId', async (req, res, next) => {
  try {
    await prisma.favorite.upsert({
      where: { userId_productId: { userId: req.user.id, productId: +req.params.productId } },
      create: { userId: req.user.id, productId: +req.params.productId },
      update: {}
    })
    return success(res, null, 'Added to favorites')
  } catch (e) { next(e) }
})

// ====== DELETE /api/v1/favorites/:productId ======
router.delete('/:productId', async (req, res, next) => {
  try {
    await prisma.favorite.delete({
      where: { userId_productId: { userId: req.user.id, productId: +req.params.productId } }
    }).catch(() => null)
    return success(res, null, 'Removed from favorites')
  } catch (e) { next(e) }
})

export default router
