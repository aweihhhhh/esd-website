/**
 * 订单路由
 */
import { Router } from 'express'
import { prisma } from '../config/db.js'
import { success, paginated, Errors } from '../utils/response.js'
import { authRequired, roleRequired } from '../middlewares/auth.js'

const router = Router()
router.use(authRequired)

// ====== GET /api/v1/orders/my ======
router.get('/my', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: +pageSize,
        include: { items: { include: { product: { select: { slug: true, model: true, images: { take: 1, where: { isPrimary: true } } } } } } }
      }),
      prisma.order.count({ where: { userId: req.user.id } })
    ])
    return paginated(res, list, total, +page, +pageSize)
  } catch (e) { next(e) }
})

// ====== GET /api/v1/orders/:id ======
router.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: +req.params.id },
      include: { items: { include: { product: true } } }
    })
    if (!order) return next(Errors.notFound())
    if (order.userId !== req.user.id && !['staff', 'admin'].includes(req.user.role)) {
      return next(Errors.forbidden())
    }
    return success(res, order)
  } catch (e) { next(e) }
})

// ====== PATCH /api/v1/orders/:id/status (员工) ======
router.patch('/:id/status', roleRequired('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, trackingNo, shippingCarrier } = req.body
    const order = await prisma.order.update({
      where: { id: +req.params.id },
      data: { status, trackingNo, shippingCarrier }
    })
    return success(res, order, 'Order updated')
  } catch (e) { next(e) }
})

// ====== GET /api/v1/orders (员工/管理员) ======
router.get('/', roleRequired('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query
    const where = {}
    if (status) where.status = status
    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: +pageSize, include: { user: true, items: true } }),
      prisma.order.count({ where })
    ])
    return paginated(res, list, total, +page, +pageSize)
  } catch (e) { next(e) }
})

export default router
