# ESD Protection Diode Wholesale — B2B 独立站

> 跨境电子元器件外贸独立站 · 200+ ESD / TVS 产品 · 响应式 PC / 平板 / 手机 · 英文 B2B

## 📁 项目结构

```
esd-website/
├── public/                    # 静态资源（直接拷贝到 dist）
│   ├── catalogs/              # PDF 目录文件（占位）
│   └── favicon.svg
├── src/
│   ├── assets/main.css        # Tailwind + 全局样式
│   ├── components/            # 公共组件
│   │   ├── SiteHeader.vue     # 顶部导航 + 询盘 CTA
│   │   ├── SiteFooter.vue     # 页脚
│   │   ├── FloatingContact.vue# WhatsApp / Email / 回顶部悬浮
│   │   ├── Breadcrumb.vue     # 面包屑
│   │   └── ProductCard.vue    # 产品卡片（列表/推荐共用）
│   ├── data/
│   │   └── products.js        # ⭐ 200+ 产品 JSON 数据源（核心）
│   ├── router/index.js        # 路由（hash 模式，适配静态托管）
│   ├── views/                 # 页面
│   │   ├── HomeView.vue       # 首页
│   │   ├── ProductsView.vue   # 产品列表（筛选/搜索/分页/批量）
│   │   ├── ProductDetailView.vue  # 产品详情
│   │   ├── InquiryView.vue    # 询价表单
│   │   ├── CatalogView.vue    # PDF 目录下载
│   │   ├── AboutView.vue      # 关于我们
│   │   ├── ContactView.vue    # 联系我们
│   │   └── NotFoundView.vue   # 404
│   ├── App.vue                # 根组件
│   └── main.js                # 入口
├── index.html                 # HTML 入口 + SEO meta
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 本地启动

```bash
# 1. 安装依赖（推荐 Node 18+）
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 3. 构建生产版本（输出到 dist/）
npm run build

# 4. 本地预览构建结果
npm run preview
```

## 🌍 部署到 Netlify

### 方式 A：拖拽部署（最简单）

1. 运行 `npm run build` 生成 `dist/`
2. 访问 [app.netlify.com/drop](https://app.netlify.com/drop)
3. 把整个 `dist/` 文件夹拖进去，30 秒拿到 `https://xxx.netlify.app`

### 方式 B：Git 自动部署（推荐）

1. 把代码推送到 GitHub
2. 在 Netlify 点击 **Add new site → Import an existing project**
3. 选择仓库，配置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18（Environment → NODE_VERSION = 18）
4. 点 Deploy，几分钟后自动上线

## ▲ 部署到 Vercel

1. 把代码推到 GitHub
2. [vercel.com/new](https://vercel.com/new) → Import 仓库
3. Framework 自动识别为 Vite
4. 点 Deploy，1 分钟拿到 `https://xxx.vercel.app`

## 🌐 绑定自定义域名

1. 在 Netlify / Vercel 后台 **Domain settings** → Add custom domain
2. 在域名注册商（阿里云 / Cloudflare / GoDaddy）添加：
   - **CNAME** 记录：`www` → `xxx.netlify.app`
   - **A** 记录：`@` → Netlify Load Balancer IP（Netlify 会提供）
3. Netlify / Vercel 自动签发 Let's Encrypt SSL 证书

## 🛠 修改教程

### 1. 新增 / 修改产品

打开 [`src/data/products.js`](src/data/products.js)：

```js
// 在对应封装数组中添加（例：SOD523）
const sod523Raw = [
  // ... 已有型号
  ['ESD5NEW', 'Unidirectional', '5V', 5, 5, '30PF', 30, '8A', 8, '3K/reel']  // 新型号
]
```

字段顺序：`model, direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, [tags]`

- `tags: ['lowCap']` → 显示"低电容"标签
- `tags: ['highSurge']` → 显示"大电流"标签
- `tags: ['array']` → 显示"阵列"标签

### 2. 修改筛选条件

打开 [`src/data/products.js`](src/data/products.js) 末尾：

```js
export const packageOptions = ['SOD923', 'SOD523', ...]   // 增删封装
export const directionOptions = [...]                      // 增删极性
export const voltageBuckets = [                            // 修改电压区间
  { label: '≤ 5V',   min: 0,  max: 5    },
  ...
]
```

### 3. 替换主色调

打开 [`tailwind.config.js`](tailwind.config.js)，修改 `colors.brand`：

```js
colors: {
  brand: {
    DEFAULT: '#0F3460',   // ← 改成你的主色
    50:  '#E8EDF5',
    ...
  }
}
```

### 4. 修改文案

- 导航菜单 → [`src/components/SiteHeader.vue`](src/components/SiteHeader.vue) 的 `menus` 数组
- 联系方式 / WhatsApp 号码 → [`src/components/FloatingContact.vue`](src/components/FloatingContact.vue) 中 `phone` 变量
- 首页优势 / 热门产品 → [`src/views/HomeView.vue`](src/views/HomeView.vue) 中 `advantages` / `hotProducts`
- SEO title / description → [`index.html`](index.html) 顶部 meta 标签 + [`src/router/index.js`](src/router/index.js) 的 `meta.title`

### 5. 替换产品图片

占位图在 [`src/components/ProductCard.vue`](src/components/ProductCard.vue) 第 6 行附近，删掉注释，启用：

```html
<img :src="product.image" :alt="product.model" class="w-full h-40 object-contain" />
```

然后在 `products.js` 里每个产品加上 `image` 字段：

```js
{ model: 'SD05', image: '/images/sd05.webp', ... }
```

图片放到 `public/images/`。

### 6. 接入真实 PDF 目录

把真实的 PDF 放到 [`public/catalogs/`](public/catalogs/)：

- `master-esd-catalog-2026.pdf` — 完整主目录
- `sod923-series.pdf`
- `sod523-series.pdf`
- ... 按命名规范即可（文件名见 [`src/views/CatalogView.vue`](src/views/CatalogView.vue)）

### 7. 多语言扩展

项目文案已集中在 `*.vue` 组件的 `<template>` / `<script>`。改造建议：
- 新建 `src/locales/en.js` / `src/locales/zh.js` 字典
- 用 `vue-i18n` 包装文案（`npm i vue-i18n`）
- 路由加 `/zh/...` 前缀

## 📞 联系 / 询盘数据存储

询价表单和联系表单都把数据写入 `localStorage`：
- 询价：`localStorage.inquiries` (JSON 数组)
- 联系：`localStorage.messages` (JSON 数组)

生产环境建议：表单提交时 POST 到自有后端 / Formspree / 飞书多维表格 / 邮箱转发。

## 📝 许可证

仅供商业演示。代码可自由修改使用。
