/**
 * 评价路由
 */
import { Router } from 'express'
import { prisma } from '../config/db.js'
import { success, paginated, Errors } from '../utils/response.js'
import { authRequired, roleRequired } from '../middlewares/auth.js'

const router = Router()

// ====== GET /api/v1/reviews?productId= ======
router.get('/', async (req, res, next) => {
  try {
    const { productId, page = 1, pageSize = 10 } = req.query
    if (!productId) return next(Errors.badRequest('productId required'))
    const where = { productId: +productId, status: 'approved' }
    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total, agg] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: +pageSize,
        include: { user: { select: { fullName: true, avatar: true, company: { select: { name: true } } } } }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where, _avg: { rating: true }, _count: true })
    ])
    return success(res, {
      list,
      total,
      averageRating: agg._avg.rating || 0,
      count: agg._count
    })
  } catch (e) { next(e) }
})

// ====== POST /api/v1/reviews ======
router.post('/', authRequired, async (req, res, next) => {
  try {
    const { productId, rating, title, content, pros, cons } = req.body
    if (!productId || !rating) return next(Errors.badRequest('productId and rating required'))
    if (rating < 1 || rating > 5) return next(Errors.badRequest('Rating 1-5'))
    const review = await prisma.review.create({
      data: {
        productId: +productId,
        userId: req.user.id,
        rating: +rating,
        title, content, pros, cons,
        status: 'pending'
      }
    })
    return success(res, review, 'Review submitted, pending approval')
  } catch (e) { next(e) }
})

// ====== PATCH /api/v1/reviews/:id/approve (员工) ======
router.patch('/:id/approve', authRequired, roleRequired('staff', 'admin'), async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: +req.params.id },
      data: { status: req.body.status || 'approved' }
    })
    return success(res, review)
  } catch (e) { next(e) }
})

export default router
