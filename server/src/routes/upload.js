/**
 * 文件上传路由 - 通用 (产品图 / BOM / 头像)
 */
import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { authRequired } from '../middlewares/auth.js'
import { success, Errors } from '../utils/response.js'

const router = Router()

// 配置: 支持按子目录
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sub = req.params.type || 'misc'
    cb(null, `uploads/${sub}/`)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }
})

// POST /api/v1/upload/:type  (type: products/avatars/boms)
router.post('/:type', authRequired, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) return next(Errors.badRequest('No file uploaded'))
    const url = `/uploads/${req.params.type}/${req.file.filename}`
    return success(res, {
      url,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }, 'Uploaded')
  } catch (e) { next(e) }
})

export default router
