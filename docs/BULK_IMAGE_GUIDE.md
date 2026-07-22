# 📷 批量图片下载完整指南

## 🎯 背景

直接爬商业网站（LCSC/Mouser/Digi-Key）通常行不通：
- ❌ 需要登录或 API key
- ❌ 反爬机制拦截自动请求
- ❌ 违反网站 ToS
- ❌ 图片有水印/分辨率低

所以我们提供 **3 种合规高效的批量下载方式**，任选其一：

---

## 🅰️ 方式 A：CSV 导入 (推荐 ⭐)

最稳定可靠。手动从供应商网站复制图片 URL 到 CSV。

### 步骤

```bash
# 1. 复制模板
cp images.csv.example images.csv

# 2. 用 Excel/记事本 打开 images.csv
#    填入 sku,slot,url 三列
#    例:
#      ESD-SOD323-SD05,01-top,https://lcsc-cdn.com/.../sd05.jpg
#      ESD-SOD323-SD05,02-pinout,https://lcsc-cdn.com/.../sd05-2.jpg
#      ... 等等

# 3. 批量下载
npm run scrape-images

# 4. 处理 (转 WebP / 缩放)
npm install sharp   # 第一次需要
npm run process-images

# 5. 生成 manifest
npm run scan-images

# 6. 浏览器自动刷新, 真图生效!
```

### 如何快速获取 URL

#### 从 LCSC (立创商城)
```
1. 打开 https://www.lcsc.com/search?q=SD05
2. 点击产品进入详情页
3. 在主图上 右键 → "复制图片地址"
4. 粘贴到 CSV
```

#### 从 Mouser / Digi-Key
```
1. 打开产品详情页
2. 右键主图 → "复制图片地址"
3. 粘贴到 CSV
```

#### 从数据手册 PDF
```
1. 打开 PDF
2. 用截图工具截取 (Win+Shift+S / Mac Cmd+Shift+4)
3. 上传到图床:
   - https://imgur.com/upload
   - https://sm.ms/
   - 自建 OSS / 七牛云
4. 复制图片 URL 到 CSV
```

### CSV 文件格式示例

```csv
sku,slot,url
ESD-SOD323-SD05,01-top,https://mydomain.com/photos/sd05-top.jpg
ESD-SOD323-SD05,02-pinout,https://mydomain.com/photos/sd05-pin.jpg
ESD-SOD323-SD05,03-circuit,https://mydomain.com/photos/sd05-pcb.jpg
ESD-SOD323-SD05,04-package,https://mydomain.com/photos/sd05-tape.jpg
ESD-SOD323-SD05,05-spec,https://mydomain.com/photos/sd05-spec.jpg
ESD-SOD323-GBLC05C,01-top,https://mydomain.com/photos/gblc05c.jpg
ESD-DFN1006-2L-ESD8L3.3,01-top,https://mydomain.com/photos/esd8l33.jpg
...
```

### Excel 批量导出 tips

```
1. 在 LCSC 后台导出产品 CSV (含图片 URL 列)
2. 用 Excel 整理成三列: sku,slot,url
3. 保存为 CSV UTF-8 编码
```

---

## 🅱️ 方式 B：LCSC 公开搜索 (用 cookie)

如果你在浏览器已登录 LCSC，可以复制 cookie 让脚本模拟登录请求。

### 步骤

```bash
# 1. 在 Chrome/Firefox 打开 lcsc.com 并登录

# 2. 打开 DevTools (F12) → Network 面板
#    任意点击一个搜索 / 产品
#    在 Network 里找到请求, 右键 → "Copy as cURL"

# 3. 从复制的 cURL 里提取 Cookie 头, 类似:
#    cookie: lcsc_user=xxx; PHPSESSID=yyy; ...

# 4. 设置环境变量 (Windows CMD):
set LCSC_COOKIE="lcsc_user=xxx; PHPSESSID=yyy; ..."

# 5. 运行 (只下 5 个测试, 确认能用再加大)
npm run scrape-images

# 6. 想要全部 221 个? 编辑 scripts/scrape-images.js:
#    找到 importFromLcsc(products) 改成 importFromLcsc(products, 999)
```

### ⚠️ 注意

- Cookie **会过期** (通常 1-7 天)，过期需重新复制
- LCSC 会限速, 脚本内置 1.5 秒间隔
- 部分产品 LCSC 可能没有, 自动跳过

---

## 🅲️ 方式 C：URL 模板 (高级用户)

如果你知道供应商的图片 URL 规则 (比如自建 CDN)。

### 步骤

```bash
# Windows CMD:
set URL_TEMPLATE="https://my-cdn.com/products/{model}/01-top.jpg"

# 5 个槽位需要分别跑, 改 {slot} 部分:
set URL_TEMPLATE="https://my-cdn.com/products/{model}/{slot}.jpg"

# 或一行命令带 5 个 slot (需要脚本支持, 暂请跑 5 次):
for %s in (01-top 02-pinout 03-circuit 04-package 05-spec) do (
  set URL_TEMPLATE="https://my-cdn.com/products/{model}/%s.jpg" && npm run scrape-images
)
```

可用占位符:
- `{sku}` - ESD-SOD323-SD05
- `{package}` - SOD323
- `{model}` - SD05
- `{slot}` - 01-top

---

## 🛠 配套工具

### 图片处理 (process-images)

下载后的图片用 sharp 库自动优化:

```bash
npm install sharp
npm run process-images
```

功能:
- 🔄 自动转 WebP 格式 (减小 30-70% 文件大小)
- 📐 自动缩放到 ≤ 800px 宽
- 📊 报告压缩比

### 扫描生成 manifest (scan-images)

```bash
npm run scan-images
```

扫描 `public/images/products/` 目录，生成 `src/generated/image-manifest.json`。
前端自动读取并优先使用真图。

---

## 📋 完整 SKU 列表获取

221 个产品的 SKU 可以从 `src/data/products.js` 获取。或者：

```bash
node -e "
import('./src/data/products.js').then(m => {
  m.products.forEach(p => {
    console.log('ESD-' + p.package + '-' + p.model)
  })
})
" > sku-list.txt
```

---

## 🎯 推荐的批量流程

```
1. 📋 准备 SKU 清单 (从 sku-list.txt)
2. 🌐 在 LCSC/Mouser 逐个打开 SKU, 复制图片地址
3. 📝 粘贴到 images.csv (用 Excel 整理)
4. 🚀 npm run scrape-images    (批量下载)
5. 🖼  npm run process-images  (压缩 + 转 WebP)
6. 📊 npm run scan-images      (生成 manifest)
7. 🌐 浏览器自动刷新, 真图生效
```

或者更简单的：
```
1. 让工厂把每个 SKU 的 5 张图打包发给你
2. 解压到 public/images/products/{SKU}/
3. npm run scan-images  (一行命令搞定)
```

---

## ❓ 常见问题

### Q1: LCSC cookie 复制后还是 401
A: cookie 过期了，重新登录再复制

### Q2: 图片有水印怎么办
A: 用美图秀秀/PS 简单去水印后再上传

### Q3: 批量下载失败很多
A: 限速了，分批下载（一次 50 个）

### Q4: 真图加载慢
A: 先跑 `npm run process-images` 自动转 WebP + 缩放

### Q5: 想用 AI 生成
A: 用 DALL-E / Midjourney 生成图后，上传到 OSS 拿 URL 填 CSV

### Q6: 想用现成的图床
A: 推送到 GitHub 后用 GitHub raw URL（但仓库会很大）
   推荐: 推到阿里云 OSS / 七牛云 / Cloudflare R2，再填 CSV