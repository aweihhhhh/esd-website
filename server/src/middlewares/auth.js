/**
 * 鉴权中间件
 * - authRequired  : 必须登录
 * - authOptional  : 可选登录 (有 token 解析, 没有放空)
 * - roleRequired  : 限定角色
 */
import { verifyToken } from '../utils/jwt.js'
import { Errors } from '../utils/response.js'
import { prisma } from '../config/db.js'

export function authRequired(req, _res, next) {
  const token = extractToken(req)
  if (!token) return next(Errors.unauthorized('Authentication required'))

  try {
    const payload = verifyToken(token)
    req.user = { id: payload.uid, role: payload.role, email: payload.email }
    next()
  } catch (e) {
    next(Errors.unauthorized('Invalid or expired token'))
  }
}

export async function authRequiredWithUser(req, _res, next) {
  const token = extractToken(req)
  if (!token) return next(Errors.unauthorized('Authentication required'))

  try {
    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.uid },
      include: { company: true }
    })
    if (!user) return next(Errors.unauthorized('User not found'))
    if (user.status !== 'active') return next(Errors.forbidden('Account is not active'))
    req.user = user
    next()
  } catch (e) {
    next(Errors.unauthorized('Invalid or expired token'))
  }
}

export function authOptional(req, _res, next) {
  const token = extractToken(req)
  if (!token) return next()
  try {
    const payload = verifyToken(token)
    req.user = { id: payload.uid, role: payload.role, email: payload.email }
  } catch (e) { /* 忽略 */ }
  next()
}

export function roleRequired(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(Errors.unauthorized())
    if (!roles.includes(req.user.role)) {
      return next(Errors.forbidden('Insufficient permissions'))
    }
    next()
  }
}

function extractToken(req) {
  const auth = req.headers.authorization || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return req.query?.token || req.cookies?.token || null
}
