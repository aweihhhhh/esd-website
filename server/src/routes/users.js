/**
 * 用户路由 - 个人中心 / 地址簿 / 资料修改
 */
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { prisma } from '../config/db.js'
import { success, Errors } from '../utils/response.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

// 所有路由都要登录
router.use(authRequired)

// ====== PATCH /api/v1/users/me ======
router.patch('/me',
  body('fullName').optional().trim().isLength({ min: 2, max: 80 }),
  body('phone').optional().trim().isLength({ max: 40 }),
  body('whatsapp').optional().trim().isLength({ max: 40 }),
  body('preferredLanguage').optional().isIn(['en', 'zh', 'pt-BR', 'ru']),
  body('preferredCurrency').optional().isIn(['USD', 'CNY', 'BRL', 'RUB', 'EUR']),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(Errors.badRequest('Validation failed', errors.array()))
      const data = { ...req.body }
      delete data.email
      delete data.password
      const user = await prisma.user.update({ where: { id: req.user.id }, data })
      return success(res, sanitize(user))
    } catch (e) { next(e) }
  }
)

// ====== POST /api/v1/users/me/change-password ======
router.post('/me/change-password',
  body('oldPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body
      const user = await prisma.user.findUnique({ where: { id: req.user.id } })
      if (!user) return next(Errors.notFound())
      const ok = await bcrypt.compare(oldPassword, user.passwordHash)
      if (!ok) return next(Errors.badRequest('Old password incorrect'))
      const passwordHash = await bcrypt.hash(newPassword, 12)
      await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } })
      return success(res, null, 'Password changed')
    } catch (e) { next(e) }
  }
)

// ====== GET /api/v1/users/me/addresses ======
router.get('/me/addresses', async (req, res, next) => {
  try {
    const list = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    })
    return success(res, list)
  } catch (e) { next(e) }
})

// ====== POST /api/v1/users/me/addresses ======
router.post('/me/addresses', async (req, res, next) => {
  try {
    const data = req.body
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      })
    }
    const addr = await prisma.address.create({ data: { ...data, userId: req.user.id } })
    return success(res, addr, 'Address added')
  } catch (e) { next(e) }
})

// ====== DELETE /api/v1/users/me/addresses/:id ======
router.delete('/me/addresses/:id', async (req, res, next) => {
  try {
    await prisma.address.delete({
      where: { id: +req.params.id, userId: req.user.id }
    })
    return success(res, null, 'Address deleted')
  } catch (e) { next(e) }
})

function sanitize(u) {
  const { passwordHash, ...safe } = u
  return safe
}

export default router
