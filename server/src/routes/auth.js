/**
 * 认证路由 - 注册 / 登录 / 刷新 / 登出 / 当前用户
 */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import { prisma } from '../config/db.js'
import { signToken } from '../utils/jwt.js'
import { success, Errors } from '../utils/response.js'
import { authRequired } from '../middlewares/auth.js'
import { logger } from '../utils/logger.js'

const router = Router()

// ====== POST /api/v1/auth/register ======
router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
  body('fullName').trim().isLength({ min: 2, max: 80 }),
  body('preferredLanguage').optional().isIn(['en', 'zh', 'pt-BR', 'ru']),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(Errors.badRequest('Validation failed', errors.array()))

      const { email, password, fullName, company, phone, preferredLanguage, preferredCurrency } = req.body

      // 检查邮箱是否已存在
      const exists = await prisma.user.findUnique({ where: { email } })
      if (exists) return next(Errors.conflict('Email already registered'))

      // 密码加密
      const passwordHash = await bcrypt.hash(password, 12)

      // 创建用户 (可选创建企业)
      const user = await prisma.$transaction(async (tx) => {
        let companyId = null
        if (company?.name) {
          const c = await tx.company.create({
            data: {
              name: company.name,
              country: company.country || 'CN',
              industry: company.industry,
              contactEmail: email,
              contactPhone: phone
            }
          })
          companyId = c.id
        }
        return tx.user.create({
          data: {
            email,
            passwordHash,
            fullName,
            phone,
            companyId,
            preferredLanguage: preferredLanguage || 'en',
            preferredCurrency: preferredCurrency || 'USD'
          }
        })
      })

      const token = signToken({ uid: user.id, role: user.role, email: user.email })
      logger.info(`New user registered: ${email}`)

      return success(res, {
        token,
        user: sanitizeUser(user)
      }, 'Registered successfully')
    } catch (e) {
      next(e)
    }
  }
)

// ====== POST /api/v1/auth/login ======
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(Errors.badRequest('Validation failed', errors.array()))

      const { email, password } = req.body
      const user = await prisma.user.findUnique({
        where: { email },
        include: { company: true }
      })
      if (!user) return next(Errors.unauthorized('Invalid email or password'))
      if (user.status !== 'active') return next(Errors.forbidden('Account is not active'))

      const ok = await bcrypt.compare(password, user.passwordHash)
      if (!ok) return next(Errors.unauthorized('Invalid email or password'))

      // 更新最后登录时间
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })

      const token = signToken({ uid: user.id, role: user.role, email: user.email })
      return success(res, { token, user: sanitizeUser(user) }, 'Login successful')
    } catch (e) {
      next(e)
    }
  }
)

// ====== GET /api/v1/auth/me ======
router.get('/me', authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { company: true }
    })
    if (!user) return next(Errors.notFound('User not found'))
    return success(res, sanitizeUser(user))
  } catch (e) {
    next(e)
  }
})

// ====== POST /api/v1/auth/logout ======
router.post('/logout', authRequired, (_req, res) => {
  // 前端清除 token 即可; 高级做法是把 token 加入 Redis 黑名单
  return success(res, null, 'Logged out')
})

// ====== 工具 ======
function sanitizeUser(u) {
  const { passwordHash, ...safe } = u
  return safe
}

export default router
