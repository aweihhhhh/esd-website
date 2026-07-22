# 数据库初始化

## 一键初始化（推荐）

```bash
cd d:/test/esd-website

# 1. 创建数据库并导入 schema (MySQL 8.0)
mysql -u root -p123456 < database/schema.sql

# 2. 进入 server 目录
cd server

# 3. 复制环境变量模板
cp .env.example .env

# 4. 安装依赖
npm install

# 5. 生成 Prisma Client
npx prisma generate

# 6. 导入种子数据（221 款产品 + 4 语言翻译 + 管理员账号）
npm run prisma:seed
```

## 默认账号

| 角色 | 邮箱 | 密码 |
|---|---|---|
| 管理员 | `admin@esd-diode.com` | `Admin@123456` |
| 演示客户 | `demo@esd-diode.com` | `Demo@123456` |

## 数据库 ER 图

```
                        ┌──────────────┐
                        │  companies   │
                        └──────┬───────┘
                               │ 1:N
                               ▼
┌──────────┐  1:N  ┌──────────┴───────┐
│   users  │◄──────┤    users          │
└────┬─────┘       └──────────────────┘
     │
     ├──── 1:N ──► addresses (收货地址)
     ├──── 1:N ──► inquiries (询价单)
     ├──── 1:N ──► orders (订单)
     ├──── 1:N ──► favorites (收藏)
     ├──── 1:N ──► compare_list (对比)
     └──── 1:N ──► reviews (评价)

categories (1) ──► (N) products
products (1) ──► (N) product_translations (4 语言)
products (1) ──► (N) product_images (5 张图)
products (1) ──► (N) product_price_breaks (价格阶梯)
products (N) ──► (N) products (product_related 自关联)

inquiries (1) ──► (N) inquiry_items
inquiries (1) ──► (N) inquiry_messages

orders (1) ──► (N) order_items

audit_logs (操作审计)
newsletter (邮件订阅)
settings (KV 配置)
```

## 21 张表

| # | 表名 | 用途 |
|---|---|---|
| 1 | users | 用户表 |
| 2 | companies | 企业表（B2B 主体） |
| 3 | addresses | 收货地址簿 |
| 4 | categories | 产品分类 |
| 5 | category_translations | 分类翻译 (4 语言) |
| 6 | products | 产品主表 |
| 7 | product_translations | 产品翻译 (4 语言) |
| 8 | product_images | 产品图 |
| 9 | product_price_breaks | 价格阶梯 |
| 10 | product_related | 替代型号关联 |
| 11 | inquiries | 询价单 |
| 12 | inquiry_items | 询价明细 |
| 13 | inquiry_messages | 询价沟通记录 |
| 14 | orders | 订单 |
| 15 | order_items | 订单明细 |
| 16 | favorites | 收藏 |
| 17 | compare_list | 对比清单 |
| 18 | reviews | 评价 |
| 19 | newsletter | 邮件订阅 |
| 20 | audit_logs | 审计日志 |
| 21 | settings | 系统配置 |
