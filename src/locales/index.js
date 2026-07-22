/**
 * i18n 配置
 * 4 语言: en (English) / zh (简体中文) / pt-BR (Português Brasil) / ru (Русский)
 * 默认 en, 浏览器语言自动检测
 */
import { createI18n } from 'vue-i18n'
import en from './en.js'
import zh from './zh.js'
import ptBR from './pt-BR.js'
import ru from './ru.js'

export const SUPPORTED_LOCALES = [
  { code: 'en',    name: 'English',     flag: '🇺🇸' },
  { code: 'zh',    name: '简体中文',     flag: '🇨🇳' },
  { code: 'pt-BR', name: 'Português',   flag: '🇧🇷' },
  { code: 'ru',    name: 'Русский',     flag: '🇷🇺' }
]

// 从 localStorage 读取上次选择的语言, 没有则用浏览器语言, 最后用 en
function detectLocale() {
  const saved = typeof window !== 'undefined' && localStorage.getItem('locale')
  if (saved && SUPPORTED_LOCALES.find(l => l.code === saved)) return saved
  const browser = typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)
  if (browser) {
    const lower = browser.toLowerCase()
    if (lower.startsWith('zh')) return 'zh'
    if (lower.startsWith('pt')) return 'pt-BR'
    if (lower.startsWith('ru')) return 'ru'
    if (lower.startsWith('en')) return 'en'
  }
  return 'en'
}

export const i18n = createI18n({
  legacy: false,                  // 使用 Composition API
  globalInjection: true,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    'pt-BR': ptBR,
    ru
  },
  // 数字格式化: 不同语言用不同千位分隔符
  numberFormats: {
    en:    { currency: { style: 'currency', currency: 'USD' } },
    zh:    { currency: { style: 'currency', currency: 'CNY' } },
    'pt-BR': { currency: { style: 'currency', currency: 'BRL' } },
    ru:    { currency: { style: 'currency', currency: 'RUB' } }
  }
})

// 切换语言并持久化
export function setLocale(code) {
  if (!SUPPORTED_LOCALES.find(l => l.code === code)) return
  i18n.global.locale.value = code
  localStorage.setItem('locale', code)
  document.documentElement.lang = code
}
