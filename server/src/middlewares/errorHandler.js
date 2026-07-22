/**
 * 错误处理中间件
 */
import { ApiError } from '../utils/response.js'
import { logger } from '../utils/logger.js'

export function notFoundHandler(req, res, _next) {
  res.status(404).json({
    code: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`
  })
}

export function errorHandler(err, req, res, _next) {
  // 业务异常
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details
    })
  }

  // Prisma 已知错误
  if (err.code === 'P2002') {
    return res.status(409).json({
      code: 409,
      message: 'Duplicate entry',
      details: { field: err.meta?.target }
    })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ code: 404, message: 'Record not found' })
  }

  // 未预期错误
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack, url: req.originalUrl })
  res.status(500).json({
    code: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  })
}
