# 📐 系统架构

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| **前端** | Vue 3.4 + Vite 5 | Composition API + 极速构建 |
| **UI 组件** | Element Plus 2.7 | B2B 后台 + 表单组件 |
| **样式** | Tailwind CSS 3.4 | 工业风 + 响应式 |
| **国际化** | vue-i18n 9.4 | 4 语言: EN/ZH/PT-BR/RU |
| **状态管理** | Pinia 2.1 | 用户/购物车/收藏 |
| **路由** | Vue Router 4.3 | Hash 模式（静态托管友好）|
| **HTTP** | Axios 1.6 | 自动 token 注入 |
| **后端** | Node.js 20 + Express 4.18 | REST API |
| **ORM** | Prisma 5.10 | 类型安全 + 自动迁移 |
| **数据库** | MySQL 8.0 | 21 张表 + utf8mb4 |
| **缓存** | Redis 7 | 限流 + 会话（可选）|
| **认证** | JWT + bcrypt | 7天 token + 12 轮加密 |
| **邮件** | Nodemailer | SMTP 询价通知 |
| **文件** | Multer | 头像/BOM/产品图上传 |
| **日志** | Winston | 按日切割 + 控制台彩色 |
| **验证** | Zod + express-validator | 前后端双重校验 |
| **安全** | Helmet + CORS + Rate Limit | 基础防护 |

---

## 数据库 ER 关系

```
┌─────────────┐
│ companies   │ (B2B 企业)
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐     ┌──────────────┐
│   users     │────►│  addresses   │
└──────┬──────┘     └──────────────┘
       │
       ├──► inquiries ──► inquiry_items ──► products
       │     │
       │     └──► inquiry_messages
       │
       ├──► orders ──► order_items ──► products
       │
       ├──► favorites ──► products
       ├──► reviews ──► products
       └──► audit_logs

categories (1) ──► (N) products (1) ──► (N) product_translations
                                   └──► (N) product_images
                                   └──► (N) product_price_breaks
                                   └──► (N) product_related
```

---

## API 路由设计

### 公开（无需登录）
- `GET    /api/v1/products`         产品列表 + 多维筛选
- `GET    /api/v1/products/featured`  热门产品
- `GET    /api/v1/products/filters`   筛选条件含计数
- `GET    /api/v1/products/:slug`     产品详情
- `GET    /api/v1/categories`         分类列表
- `POST   /api/v1/inquiries`          提交询价（支持 BOM 上传）
- `POST   /api/v1/auth/register`      注册
- `POST   /api/v1/auth/login`         登录
- `GET    /api/v1/i18n/:lang`         翻译文案

### 需登录
- `GET    /api/v1/auth/me`           当前用户
- `GET    /api/v1/users/me`           个人资料
- `PATCH  /api/v1/users/me`           修改资料
- `GET    /api/v1/inquiries/my`       我的询价
- `GET    /api/v1/orders/my`          我的订单
- `GET    /api/v1/favorites`           收藏列表
- `POST   /api/v1/favorites/:id`      添加收藏
- `GET    /api/v1/users/me/addresses` 地址簿

### 员工/管理员
- `GET    /api/v1/admin/stats`         仪表盘统计
- `GET    /api/v1/admin/inquiries`     所有询价
- `PATCH  /api/v1/admin/inquiries/:id` 更新状态
- `GET    /api/v1/admin/users`         用户管理
- `POST   /api/v1/admin/products`      创建产品
- `PATCH  /api/v1/admin/products/:id`  修改产品

---

## 国际化（i18n）设计

### 4 语言支持矩阵
| 语言 | 适配市场 | 默认地区 |
|---|---|---|
| English (en) | 全球 | 默认 |
| 简体中文 (zh) | 中国大陆 | 默认 zh-CN |
| Português (pt-BR) | 巴西 | 巴西雷亚尔 BRL |
| Русский (ru) | 俄罗斯/独联体 | 卢布 RUB |

### 多语言实现
- **前端**：`vue-i18n` 字典 + 浏览器语言自动检测 + 手动切换器
- **后端**：数据库 `product_translations` 表 + `category_translations` 表，4 行（每种语言一行）
- **切换器**：`LangSwitcher.vue` 组件 + localStorage 持久化
- **自动同步**：用户登录后用其 `preferredLanguage` 覆盖

---

## 安全设计

1. **密码加密**：bcrypt 12 轮
2. **JWT**：HS256，7 天过期
3. **CORS**：白名单（生产环境只允许 Vercel 域名）
4. **Helmet**：设置安全 HTTP 头
5. **Rate Limit**：生产环境 100 req/min per IP
6. **SQL 注入**：Prisma 参数化查询
7. **XSS**：Vue 默认转义 + CSP 头
8. **审计日志**：登录、修改、删除都记录
9. **HTTPS**：Vercel/Railway 自动签发证书
10. **文件上传**：限制 mimetype 和 size（10MB）

---

## 性能优化

| 优化点 | 方案 |
|---|---|
| 静态资源 | Vite 自动 code splitting + tree shaking |
| 图片 | 5 张 SVG 程序化生成（内联 data URI，0 HTTP）|
| API 缓存 | 热门产品 Redis 缓存 5 分钟 |
| 数据库 | 关键字段加索引（model / package / vrwm）|
| 搜索 | MySQL FULLTEXT 索引（生产建议 Meilisearch）|
| 懒加载 | 路由级 code splitting（动态 import）|
| 压缩 | Express compression 中间件 |
| CDN | Vercel 边缘网络 + Cloudflare |

---

## 监控告警

| 监控项 | 工具 | 阈值 |
|---|---|---|
| 前端错误 | Sentry | 5% 错误率 |
| API 响应时间 | Vercel Analytics + 自建 | p95 > 2s |
| 数据库慢查询 | PlanetScale Insights | > 1s |
| 服务器 CPU/RAM | Railway | CPU > 80% |
| 询盘邮件 | Mailgun 投递率 | < 95% |
