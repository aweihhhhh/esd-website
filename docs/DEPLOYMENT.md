# 🚀 部署指南

本项目包含三部分部署：**前端（Vue 3）** + **后端（Node.js API）** + **数据库（MySQL）**

---

## 🎯 部署架构总览

```
┌──────────────────────────────────────────────────────────┐
│ 用户浏览器                                                │
└──────────┬───────────────────────┬───────────────────────┘
           │                       │
           ▼                       ▼
   ┌──────────────┐        ┌──────────────┐
   │  前端 (CDN)  │        │  后端 API    │
   │ Vercel/Netlify│       │ Railway/Render│
   │ Vue 3 静态文件│ ◄───► │ Node.js + DB │
   └──────────────┘   API  └──────┬───────┘
                                 │
                                 ▼
                          ┌─────────────┐
                          │  MySQL 8.0  │
                          │ PlanetScale │
                          │  / Aiven    │
                          └─────────────┘
```

---

## 1️⃣ 数据库部署（PlanetScale 免费 MySQL）

**PlanetScale** 提供 1 个免费 MySQL 数据库（5GB 存储，无限期）。

### 步骤：
1. 打开 https://planetscale.com/ 注册（GitHub 登录）
2. 点 **Create database** → 选区域（建议 `AWS ap-northeast-1` 离中国近）
3. Database name: `esd-website`
4. 创建后点 **Connect** → 选 **Prisma** → 复制连接字符串
5. 在控制台点击 **Branches** → main → **Console** → 粘贴 `database/schema.sql` 全部内容 → 执行
6. 等待所有表创建完成（21 张表）

### 拿到 DATABASE_URL 类似：
```
mysql://xxxxxxxx:pscale_pw_xxx@aws.connect.psdb.cloud/esd-website?ssl={"rejectUnauthorized":true}
```

---

## 2️⃣ 后端部署（Railway）

**Railway** 提供每月 $5 免费额度（足够小项目运行）。

### 步骤：
1. 打开 https://railway.app 用 GitHub 登录
2. **New Project** → **Deploy from GitHub repo** → 选 `aweihhhhh/esd-website`
3. **Settings** → 切换 Root Directory 为 `server`
4. **Variables** 添加环境变量：
   ```
   NODE_ENV=production
   PORT=4000
   API_PREFIX=/api/v1
   CORS_ORIGIN=https://esd-website.vercel.app
   
   DATABASE_URL=mysql://xxx:xxx@xxx/esd-website  # 刚才的连接串
   
   JWT_SECRET=随机长字符串
   JWT_EXPIRES_IN=7d
   
   FRONTEND_URL=https://esd-website.vercel.app
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="ESD Diode <sales@esd-diode.com>"
   ```
5. **Deploy** → 等 2-3 分钟
6. 部署成功后在 **Settings → Networking → Generate Domain** 拿到一个 `*.up.railway.app` 地址
7. **重要**：配置 Build Command: `npm install && npx prisma generate` ，Start Command: `npm start`
8. 首次部署后，运行 seed 导入数据：
   - 在 Railway 控制台 → **Variables** 添加临时 `RUN_SEED=true`
   - 或者 SSH 进容器执行 `npm run prisma:seed`

---

## 3️⃣ 前端部署（Vercel 免费）

### 步骤：
1. 打开 https://vercel.com 用 GitHub 登录
2. **Add New → Project** → Import `aweihhhhh/esd-website`
3. 配置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `./` （不要改成 src）
4. **Environment Variables** 添加：
   ```
   VITE_API_BASE=https://你的-api.up.railway.app/api/v1
   ```
5. 点 **Deploy** → 30 秒后拿到 `https://esd-website.vercel.app`

---

## 4️⃣ 绑定自定义域名

### 前端（Vercel）：
1. Vercel → Settings → Domains → Add `esd-diode.com`
2. 在域名注册商添加 CNAME：`www` → `cname.vercel-dns.com`
3. A 记录：`@` → `76.76.21.21`

### 后端（Railway）：
1. Railway → Settings → Networking → Custom Domain → `api.esd-diode.com`
2. 添加 CNAME：`api` → 你的 Railway 域名

---

## 5️⃣ 初始化数据

部署完成后，需要导入 221 款产品和 4 语言翻译：

```bash
# 本地连上远程数据库
DATABASE_URL="mysql://xxx@xxx/esd-website" node server/prisma/seed.js
```

或者用 Railway 的 CLI：
```bash
railway run npm run prisma:seed
```

---

## 6️⃣ 监控 & 维护

| 项目 | 工具 | 用途 |
|---|---|---|
| 前端监控 | Vercel Analytics | 访问量、性能 |
| 后端监控 | Railway Logs | 应用日志 |
| 错误追踪 | Sentry (免费) | 前后端异常捕获 |
| 数据库备份 | PlanetScale 自动 | 每日备份 |

---

## 💰 成本估算

| 服务 | 免费额度 | 超出后 |
|---|---|---|
| Vercel 前端 | 100GB 流量/月 | $20/月起 |
| Railway 后端 | $5/月额度 | $0.000231/分钟 |
| PlanetScale MySQL | 1 个 5GB DB | $29/月起 |
| 域名 | - | ~$10/年 |
| **合计** | **可免费启动** | 生产约 $30-50/月 |

---

## 🆘 常见问题

### Q1: 前端部署后 API 请求跨域报错
→ 检查 Railway 的 CORS_ORIGIN 环境变量是否包含 Vercel 的域名

### Q2: 数据库连接失败
→ PlanetScale 必须用 SSL，确认 DATABASE_URL 带 `?ssl={"rejectUnauthorized":true}`

### Q3: Prisma 报错 "Environment variable not found: DATABASE_URL"
→ Railway Variables 没设对，或者在 server 目录下设

### Q4: 邮件发不出去
→ Gmail 必须用"应用专用密码"，不是登录密码

---

## 🎉 部署完成检查清单

- [ ] 前端 Vercel 部署成功，访问 `https://xxx.vercel.app` 看到首页
- [ ] 后端 Railway 部署成功，访问 `https://xxx.up.railway.app/health` 返回 `{"status":"ok"}`
- [ ] 数据库 21 张表已创建
- [ ] Seed 数据导入成功，221 款产品 + 4 语言翻译都在
- [ ] 切换语言测试 EN/ZH/PT-BR/RU 都正常
- [ ] 提交一次询价测试，能收到邮件通知
- [ ] 用 admin 账号登录，能进 `/admin` 后台
