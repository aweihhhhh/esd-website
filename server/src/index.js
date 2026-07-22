/**
 * ESD Diode Wholesale - Backend API 入口
 * Express + Prisma + JWT + i18n
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

import { logger } from './utils/logger.js'
import { prisma } from './config/db.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import apiRouter from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 4000
const API_PREFIX = process.env.API_PREFIX || '/api/v1'

// ====== 基础中间件 ======
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(compression())
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true
}))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// 静态资源 (上传的文件)
app.use('/uploads', express.static('uploads', { maxAge: '7d' }))

// 请求日志
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`)
  next()
})

// ====== 限流 (生产环境) ======
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', rateLimit({
    windowMs: 60_000,
    max: 100,
    message: { code: 429, message: 'Too many requests, please slow down' }
  }))
}

// ====== 路由 ======
app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'esd-website-api',
  version: '1.0.0',
  time: new Date().toISOString()
}))

app.use(API_PREFIX, apiRouter)

// ====== 错误处理 ======
app.use(notFoundHandler)
app.use(errorHandler)

// ====== 启动 ======
async function bootstrap() {
  try {
    // 测试数据库连接
    await prisma.$connect()
    logger.info('✓ Database connected')

    app.listen(PORT, () => {
      logger.info(`✓ API server running on http://localhost:${PORT}${API_PREFIX}`)
      logger.info(`✓ Health check: http://localhost:${PORT}/health`)
    })
  } catch (err) {
    logger.error('✗ Failed to start:', err)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

bootstrap()
