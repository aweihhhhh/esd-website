# ESD Protection Diode Wholesale — Full B2B Stack

> 跨境电子元器件外贸独立站 · 200+ ESD / TVS 产品 · 4 语言 (EN/中文/PT-BR/RU) · 完整前后端 + 数据库

## 🏗️ 项目结构

```
esd-website/
├── src/                      # 前端 (Vue 3 + Vite)
│   ├── locales/              # i18n 4 语言字典
│   │   ├── en.js  zh.js  pt-BR.js  ru.js
│   │   └── index.js          # i18n 配置 + 自动检测
│   ├── api/client.js         # Axios HTTP 客户端
│   ├── store/user.js         # Pinia 用户状态
│   ├── data/products.js      # 221 款产品
│   ├── data/productImages.js # 自动生成 5 张 SVG
│   ├── components/           # 公共组件
│   │   ├── SiteHeader.vue   LangSwitcher.vue  ProductCard.vue
│   │   ├── FloatingContact.vue  Breadcrumb.vue
│   ├── views/                # 页面
│   │   ├── HomeView.vue      ProductsView.vue
│   │   ├── ProductDetailView.vue  InquiryView.vue
│   │   ├── CatalogView.vue   AboutView.vue  ContactView.vue
│   │   ├── LoginView.vue     RegisterView.vue   # 新增: 登录注册
│   │   ├── AccountView.vue                       # 新增: 个人中心
│   │   ├── AdminView.vue                          # 新增: 后台管理
│   │   └── NotFoundView.vue
│   └── router/index.js
│
├── server/                   # 后端 (Node.js + Express)
│   ├── prisma/
│   │   ├── schema.prisma     # ORM 模型
│   │   └── seed.js           # 种子数据
│   ├── src/
│   │   ├── index.js          # Express 入口
│   │   ├── config/db.js      # Prisma 单例
│   │   ├── middlewares/      # auth / errorHandler
│   │   ├── routes/           # 10 个路由文件
│   │   ├── services/email.js # Nodemailer
│   │   └── utils/            # logger / jwt / response
│   ├── uploads/              # 文件上传
│   ├── .env.example
│   └── package.json
│
├── database/                 # 数据库
│   ├── schema.sql            # 21 张表 DDL
│   └── README.md
│
├── docs/
│   ├── DEPLOYMENT.md         # 部署指南
│   └── ARCHITECTURE.md       # 架构文档
│
└── public/                   # 静态资源
    ├── catalogs/              # PDF 目录
    └── favicon.svg
```

## 🚀 快速开始

### 前端
```bash
npm install
npm run dev          # http://localhost:5173
npm run build
```

### 后端 + 数据库
```bash
# 1. 创建数据库
mysql -u root -p123456 < database/schema.sql

# 2. 后端初始化
cd server
cp .env.example .env       # 修改 DATABASE_URL 等
npm install
npx prisma generate
npm run prisma:seed        # 导入 221 款产品 + 4 语言翻译

# 3. 启动
npm run dev                # http://localhost:4000
```

### 4 语言切换

顶部右上角点击 🇨🇳 / 🇺🇸 / 🇧🇷 / 🇷🇺 切换，浏览器语言自动检测，登录后跟随用户偏好。

## 🌐 在线访问

- **生产前端**: https://esd-website.vercel.app (待部署)
- **API 健康检查**: https://api.esd-diode.com/health (待部署)
- **管理后台**: `/admin` 路径（admin@esd-diode.com / Admin@123456）

## 📊 核心数据

- **221 款 ESD 防护二极管** (覆盖 14 种封装)
- **4 语言完整翻译** (en/zh/pt-BR/ru)
- **21 张数据库表** (含 B2B 询价/订单/收藏/评价/审计)
- **10 个后端路由模块** (auth/products/inquiries/users/orders/favorites/reviews/admin/i18n/upload)
- **11 个前端页面** (含登录/注册/个人中心/后台)
- **5 张自动生成的 SVG 图** (1105 张图零 HTTP 请求)

## 🛠 详细文档

- 📖 [部署指南](docs/DEPLOYMENT.md) - 完整 Vercel + Railway + PlanetScale 部署步骤
- 🏗️ [系统架构](docs/ARCHITECTURE.md) - 技术栈/ER图/API设计/安全/性能

## 🆘 默认账号 (开发环境)

| 角色 | 邮箱 | 密码 |
|---|---|---|
| 管理员 | admin@esd-diode.com | Admin@123456 |
| 客户 | demo@esd-diode.com | Demo@123456 |
