/**
 * 国际化文案 API
 * 前端按需从后端拉取当前语言的所有翻译
 * 也可以走前端 i18next 离线包
 */
import { Router } from 'express'
import { success } from '../utils/response.js'

const router = Router()

// 简易版: 内存中的多语言字典
// 生产环境应该读数据库或 JSON 文件
const translations = {
  en: {
    nav: { home: 'Home', products: 'Products', catalog: 'Catalog', about: 'About', contact: 'Contact' },
    home: { heroTitle: 'ESD Surge Protection Diode Wholesale', heroSub: 'Factory direct, 200+ SMD ESD / TVS models in stock' },
    btn: { inquire: 'Inquire', quote: 'Get a Quote', download: 'Download', details: 'Details' },
    // ... 完整字典省略
  },
  zh: {
    nav: { home: '首页', products: '产品', catalog: '目录', about: '关于', contact: '联系' },
    home: { heroTitle: 'ESD 浪涌保护二极管批发', heroSub: '工厂直销, 200+ 款 SMD ESD / TVS 现货' },
    btn: { inquire: '询价', quote: '获取报价', download: '下载', details: '详情' }
  },
  'pt-BR': {
    nav: { home: 'Início', products: 'Produtos', catalog: 'Catálogo', about: 'Sobre', contact: 'Contato' },
    home: { heroTitle: 'Atacado de Diodos ESD de Proteção', heroSub: 'Direto da fábrica, mais de 200 modelos SMD ESD/TVS em estoque' },
    btn: { inquire: 'Consultar', quote: 'Solicitar Cotação', download: 'Baixar', details: 'Detalhes' }
  },
  ru: {
    nav: { home: 'Главная', products: 'Продукция', catalog: 'Каталог', about: 'О нас', contact: 'Контакты' },
    home: { heroTitle: 'ЭСР диоды оптом - защита от перенапряжений', heroSub: 'Напрямую с завода, более 200 моделей SMD ЭСР/TVS на складе' },
    btn: { inquire: 'Запросить', quote: 'Получить цену', download: 'Скачать', details: 'Подробнее' }
  }
}

router.get('/:lang', (req, res, next) => {
  try {
    const lang = req.params.lang
    const dict = translations[lang]
    if (!dict) return success(res, {}, 'Language not found, returning empty')
    return success(res, dict)
  } catch (e) { next(e) }
})

router.get('/', (_req, res) => {
  return success(res, { supported: Object.keys(translations) })
})

export default router
