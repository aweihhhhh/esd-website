/**
 * 询价单路由 - 公开提交 + 后台管理
 */
import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { prisma } from '../config/db.js'
import { success, paginated, Errors } from '../utils/response.js'
import { authRequired, roleRequired } from '../middlewares/auth.js'
import { logger } from '../utils/logger.js'
import { sendInquiryNotification } from '../services/email.js'

const router = Router()

// ====== 文件上传 (BOM) ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/boms/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /\.(xls|xlsx|csv|pdf)$/i.test(file.originalname)
    cb(ok ? null : new Error('Only xlsx/csv/pdf allowed'), ok)
  }
})

// ====== POST /api/v1/inquiries (公开) ======
router.post('/', upload.single('bom'), async (req, res, next) => {
  try {
    const {
      companyName, contactName, contactEmail, contactPhone, whatsapp,
      country, industry, application,
      totalQty, targetPrice, currency, incoterm, notes,
      items, preferredLanguage
    } = req.body

    // 必填验证
    if (!companyName || !contactName || !contactEmail) {
      return next(Errors.badRequest('Missing required fields'))
    }

    // 解析 items (前端 JSON 字符串)
    let parsedItems = []
    try { parsedItems = typeof items === 'string' ? JSON.parse(items) : (items || []) }
    catch (e) { parsedItems = [] }

    // 生成询价单号 INQ-YYYY-NNNNN
    const year = new Date().getFullYear()
    const count = await prisma.inquiry.count({
      where: { createdAt: { gte: new Date(`${year}-01-01`) } }
    })
    const inquiryNo = `INQ-${year}-${String(count + 1).padStart(5, '0')}`

    // 创建询价单 + 明细
    const inquiry = await prisma.inquiry.create({
      data: {
        inquiryNo,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        whatsapp,
        country,
        industry,
        application,
        totalQty: +totalQty || parsedItems.reduce((s, i) => s + (+i.qty || 0), 0),
        targetPrice: targetPrice ? +targetPrice : null,
        currency: currency || 'USD',
        incoterm: incoterm || 'FOB',
        notes,
        preferredLanguage: preferredLanguage || 'en',
        bomFileUrl: req.file ? `/uploads/boms/${req.file.filename}` : null,
        source: 'web',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']?.slice(0, 500),
        items: {
          create: parsedItems.map(it => ({
            productId: it.productId || null,
            model: it.model || '',
            brand: it.brand,
            packageType: it.package,
            qty: +it.qty || 0,
            targetPrice: it.targetPrice ? +it.targetPrice : null,
            remark: it.remark
          }))
        }
      },
      include: { items: true }
    })

    // 异步: 发邮件通知销售 (失败也不阻塞)
    sendInquiryNotification(inquiry).catch(err =>
      logger.error('Failed to send inquiry email:', err)
    )

    logger.info(`New inquiry ${inquiryNo} from ${contactEmail}`)
    return success(res, { inquiryNo, id: inquiry.id }, 'Inquiry submitted successfully')
  } catch (e) { next(e) }
})

// ====== GET /api/v1/inquiries/my (登录用户自己的询价) ======
router.get('/my', authRequired, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total] = await Promise.all([
      prisma.inquiry.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: +pageSize,
        include: { items: true }
      }),
      prisma.inquiry.count({ where: { userId: req.user.id } })
    ])
    return paginated(res, list, total, +page, +pageSize)
  } catch (e) { next(e) }
})

// ====== GET /api/v1/inquiries (管理员/员工) ======
router.get('/', authRequired, roleRequired('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query
    const where = {}
    if (status) where.status = status
    const skip = (Math.max(1, +page) - 1) * +pageSize
    const [list, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: +pageSize,
        include: { items: true, user: { select: { id: true, email: true, fullName: true } } }
      }),
      prisma.inquiry.count({ where })
    ])
    return paginated(res, list, total, +page, +pageSize)
  } catch (e) { next(e) }
})

// ====== GET /api/v1/inquiries/:id ======
router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const inq = await prisma.inquiry.findUnique({
      where: { id: +req.params.id },
      include: {
        items: { include: { product: { select: { slug: true, model: true, images: { take: 1, where: { isPrimary: true } } } } } },
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { id: true, email: true, fullName: true, phone: true, company: true } }
      }
    })
    if (!inq) return next(Errors.notFound('Inquiry not found'))
    // 客户只能看自己的
    if (req.user.role === 'customer' && inq.userId !== req.user.id) {
      return next(Errors.forbidden())
    }
    return success(res, inq)
  } catch (e) { next(e) }
})

// ====== PATCH /api/v1/inquiries/:id/status (员工) ======
router.patch('/:id/status', authRequired, roleRequired('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, internalNotes, quoteAmount, quoteCurrency } = req.body
    const inq = await prisma.inquiry.update({
      where: { id: +req.params.id },
      data: { status, internalNotes, quoteAmount, quoteCurrency }
    })
    return success(res, inq, 'Status updated')
  } catch (e) { next(e) }
})

// ====== POST /api/v1/inquiries/:id/messages ======
router.post('/:id/messages', authRequired, async (req, res, next) => {
  try {
    const msg = await prisma.inquiryMessage.create({
      data: {
        inquiryId: +req.params.id,
        senderType: req.user.role === 'customer' ? 'customer' : 'staff',
        senderId: req.user.id,
        content: req.body.content
      }
    })
    return success(res, msg, 'Message sent')
  } catch (e) { next(e) }
})

export default router
