/**
 * 统一响应格式 + 业务错误类
 */

/**
 * 业务异常基类
 * 抛出后会被 errorHandler 捕获并返回标准化 JSON
 */
export class ApiError extends Error {
  constructor(code, message, statusCode = 400, details = null) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

export const Errors = {
  badRequest: (msg = 'Bad request', details) => new ApiError(400, msg, 400, details),
  unauthorized: (msg = 'Unauthorized') => new ApiError(401, msg, 401),
  forbidden: (msg = 'Forbidden') => new ApiError(403, msg, 403),
  notFound: (msg = 'Not found') => new ApiError(404, msg, 404),
  conflict: (msg = 'Conflict') => new ApiError(409, msg, 409),
  tooManyRequests: (msg = 'Too many requests') => new ApiError(429, msg, 429),
  internal: (msg = 'Internal server error') => new ApiError(500, msg, 500)
}

/**
 * 成功响应包装
 */
export function success(res, data = null, message = 'OK') {
  return res.json({ code: 0, message, data })
}

export function paginated(res, list, total, page = 1, pageSize = 20) {
  return res.json({
    code: 0,
    message: 'OK',
    data: { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  })
}
