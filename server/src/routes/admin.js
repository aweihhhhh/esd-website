/**
 * 管理员路由 - 仪表盘 / 统计 / 用户管理
 */
import { Router } from 'express'
import { prisma } from '../config/db.js'
import { success } from '../utils/response.js'
import { authRequired, roleRequired } from '../middlewares/auth.js'

const router = Router()
router.use(authRequired, roleRequired('staff', 'admin'))

// ====== GET /api/v1/admin/stats ======
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, inquiries, products, orders] = await Promise.all([
      prisma.user.count(),
      prisma.inquiry.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count()
    ])
    const [newInquiries, pendingOrders, totalRevenue, recentInquiries] = await Promise.all([
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.order.count({ where: { status: { in: ['pending', 'confirmed'] } } }),
      prisma.order.aggregate({ where: { status: { in: ['paid', 'shipped', 'delivered'] } }, _sum: { total: true } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, inquiryNo: true, companyName: true, contactEmail: true, status: true, totalQty: true, createdAt: true }
      })
    ])
    return success(res, {
      counts: { users, inquiries, products, orders },
      alerts: { newInquiries, pendingOrders },
      revenue: { total: Number(totalRevenue._sum.total) || 0 },
      recentInquiries
    })
  } catch (e) { next(e) }
})

// ====== GET /api/v1/admin/users ======
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, q } = req.query
    const where = {}
    if (q) where.OR = [
      { email: { contains: q } },
      { fullName: { contains: q } }
    ]
    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: +pageSize,
        select: { id: true, email: true, fullName: true, role: true, status: true, preferredLanguage: true, createdAt: true, lastLoginAt: true, company: { select: { name: true, country: true } } }
      }),
      prisma.user.count({ where })
    ])
    return success(res, { list, total, page: +page, pageSize: +pageSize })
  } catch (e) { next(e) }
})

// ====== PATCH /api/v1/admin/users/:id ======
router.patch('/users/:id', async (req, res, next) => {
  try {
    const { role, status } = req.body
    const user = await prisma.user.update({
      where: { id: +req.params.id },
      data: { role, status }
    })
    return success(res, { id: user.id, role: user.role, status: user.status })
  } catch (e) { next(e) }
})

// ====== CRUD: Products ======
router.post('/products', async (req, res, next) => {
  try {
    const product = await prisma.product.create({ data: req.body })
    return success(res, product, 'Product created')
  } catch (e) { next(e) }
})

router.patch('/products/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: +req.params.id },
      data: req.body
    })
    return success(res, product, 'Product updated')
  } catch (e) { next(e) }
})

router.delete('/products/:id', async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: +req.params.id },
      data: { isActive: false }
    })
    return success(res, null, 'Product deactivated')
  } catch (e) { next(e) }
})

export default router
