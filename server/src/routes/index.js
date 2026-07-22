/**
 * API 路由汇总
 */
import { Router } from 'express'
import authRoutes from './auth.js'
import productRoutes from './products.js'
import categoryRoutes from './categories.js'
import inquiryRoutes from './inquiries.js'
import userRoutes from './users.js'
import orderRoutes from './orders.js'
import uploadRoutes from './upload.js'
import favoriteRoutes from './favorites.js'
import reviewRoutes from './reviews.js'
import adminRoutes from './admin.js'
import i18nRoutes from './i18n.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/inquiries', inquiryRoutes)
router.use('/users', userRoutes)
router.use('/orders', orderRoutes)
router.use('/upload', uploadRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/reviews', reviewRoutes)
router.use('/admin', adminRoutes)
router.use('/i18n', i18nRoutes)

export default router
