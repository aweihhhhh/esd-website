/**
 * Prisma 数据库单例
 */
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['warn', 'error']
    : ['error']
})

// 优雅关闭
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
