/**
 * Winston 日志
 * 生产环境写文件 + 控制台; 开发环境只输出彩色控制台
 */
import winston from 'winston'

const isDev = process.env.NODE_ENV !== 'production'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  isDev
    ? winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) =>
          `${timestamp} ${level} ${stack || message}`)
      )
    : winston.format.json()
)

const transports = [
  new winston.transports.Console({
    format: logFormat
  })
]

// 生产环境加按日切割的文件日志
if (!isDev) {
  transports.push(
    new (await import('winston-daily-rotate-file')).default({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  )
}

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  transports,
  exceptionHandlers: [
    new winston.transports.Console({ format: logFormat })
  ]
})
