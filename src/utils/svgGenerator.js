/**
 * SVG 产品图生成器
 * ----------------------------------------------------------------------------
 * 为每个 ESD 防护二极管产品自动生成 5 张工业风示意图：
 *   1. topView      - 产品俯视外形（按实际封装尺寸比例）
 *   2. pinout       - 引脚定义
 *   3. appCircuit   - 典型应用电路
 *   4. packageTape  - SMD 卷盘包装
 *   5. specCurve    - 电气特性曲线（V-I 击穿曲线 / Cj-V 曲线）
 *
 * 所有 SVG 都是字符串，可直接 inline 到 HTML（无 HTTP 请求、加载极快、零版权风险）
 * ----------------------------------------------------------------------------
 */

// ============= 封装尺寸定义（mm） =============
const PACKAGE_DIMS = {
  'SOD923':      { w: 1.00, h: 0.60, pins: 2, name: 'SOD-923' },
  'SOD523':      { w: 1.60, h: 0.80, pins: 2, name: 'SOD-523' },
  'SOD323':      { w: 2.50, h: 1.25, pins: 2, name: 'SOD-323' },
  'SOT363':      { w: 2.00, h: 1.25, pins: 6, name: 'SOT-363' },
  'SOT353':      { w: 1.60, h: 1.60, pins: 5, name: 'SOT-353' },
  'SOT23-6L':    { w: 2.90, h: 1.60, pins: 6, name: 'SOT-23-6L' },
  'SOT23-5L':    { w: 2.90, h: 1.60, pins: 5, name: 'SOT-23-5L' },
  'SOT23':       { w: 2.90, h: 1.30, pins: 3, name: 'SOT-23' },
  'SOT523':      { w: 1.60, h: 0.80, pins: 5, name: 'SOT-523' },
  'SOT323':      { w: 2.00, h: 1.25, pins: 3, name: 'SOT-323' },
  'DFN0603-2L':  { w: 0.60, h: 0.30, pins: 2, name: 'DFN0603-2L' },
  'DFN1006-2L':  { w: 1.00, h: 0.60, pins: 2, name: 'DFN1006-2L' },
  'DFN1006-3L':  { w: 1.00, h: 0.60, pins: 3, name: 'DFN1006-3L' },
  'DFN2510-10L': { w: 2.50, h: 1.00, pins:10, name: 'DFN2510-10L' }
}

const BRAND = '#0F3460'
const ACCENT = '#E94560'
const GRAY = '#6B7280'
const LIGHT = '#E5E7EB'

/**
 * 通用工具：生成带水印的 SVG 容器
 */
function wrapSVG(content, w = 400, h = 300, bg = '#F9FAFB') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    ${content}
  </svg>`
}

/* ============================================================
 * 1. 俯视图 (Top View)
 * 按实际封装尺寸比例绘制外形 + 极性标识 + 引脚
 * ============================================================ */
export function generateTopView(product) {
  const dim = PACKAGE_DIMS[product.package] || PACKAGE_DIMS['SOD323']
  const W = 400, H = 300
  // 按比例缩放到画布 (留边距 60)
  const maxW = 280, maxH = 160
  const ratio = Math.min(maxW / dim.w, maxH / dim.h)
  const pw = dim.w * ratio, ph = dim.h * ratio
  const cx = W / 2, cy = H / 2 - 10

  let body
  if (dim.pins === 2) {
    // 2 引脚封装: 矩形 + 两端金属焊盘
    body = `
      <rect x="${cx - pw/2}" y="${cy - ph/2}" width="${pw}" height="${ph}"
            rx="2" fill="#1F2937" stroke="${BRAND}" stroke-width="1.5"/>
      <rect x="${cx - pw/2 - 14}" y="${cy - 15}" width="12" height="30" fill="#C0C4CC" stroke="${GRAY}" stroke-width="0.5"/>
      <rect x="${cx + pw/2 + 2}"  y="${cy - 15}" width="12" height="30" fill="#C0C4CC" stroke="${GRAY}" stroke-width="0.5"/>
      <text x="${cx - pw/2 - 8}" y="${cy + 4}" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">1</text>
      <text x="${cx + pw/2 + 8}" y="${cy + 4}" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">2</text>
    `
  } else {
    // 多引脚封装: 矩形 + 多焊盘
    body = `
      <rect x="${cx - pw/2}" y="${cy - ph/2}" width="${pw}" height="${ph}"
            rx="3" fill="#1F2937" stroke="${BRAND}" stroke-width="1.5"/>
    `
    const pinCount = dim.pins
    const pinW = 8, pinH = 16
    const spacing = pw / (pinCount + 1)
    for (let i = 0; i < pinCount; i++) {
      const x = cx - pw/2 + spacing * (i + 1) - pinW/2
      body += `<rect x="${x}" y="${cy - ph/2 - pinH + 2}" width="${pinW}" height="${pinH}"
                      fill="#C0C4CC" stroke="${GRAY}" stroke-width="0.5"/>`
      body += `<rect x="${x}" y="${cy + ph/2 - 2}" width="${pinW}" height="${pinH}"
                      fill="#C0C4CC" stroke="${GRAY}" stroke-width="0.5"/>`
    }
  }

  // 极性标识
  const polarityMark = product.direction === 'Bidirectional'
    ? `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="14" fill="${ACCENT}" font-weight="700">◄►</text>`
    : `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="14" fill="${ACCENT}" font-weight="700">▶|</text>`

  // 尺寸标注
  const dimLine = `
    <line x1="${cx - pw/2}" y1="${H - 50}" x2="${cx + pw/2}" y2="${H - 50}" stroke="${GRAY}" stroke-width="0.5"/>
    <line x1="${cx - pw/2}" y1="${H - 54}" x2="${cx - pw/2}" y2="${H - 46}" stroke="${GRAY}" stroke-width="0.5"/>
    <line x1="${cx + pw/2}" y1="${H - 54}" x2="${cx + pw/2}" y2="${H - 46}" stroke="${GRAY}" stroke-width="0.5"/>
    <text x="${cx}" y="${H - 35}" text-anchor="middle" font-size="11" fill="${GRAY}">${dim.w} mm × ${dim.h} mm</text>
  `

  // 标题 + 水印
  return wrapSVG(`
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${BRAND}">${dim.name} - Top View</text>
    ${body}
    ${polarityMark}
    ${dimLine}
    <text x="${W - 8}" y="${H - 8}" text-anchor="end" font-size="8" fill="${LIGHT}">ESD-Diode Wholesale</text>
  `, W, H)
}

/* ============================================================
 * 2. 引脚定义 (Pinout)
 * ============================================================ */
export function generatePinout(product) {
  const dim = PACKAGE_DIMS[product.package] || PACKAGE_DIMS['SOD323']
  const W = 400, H = 300
  const cx = W / 2, cy = H / 2 - 10

  // 决定引脚功能
  const pinLabels = []
  if (dim.pins === 2) {
    pinLabels[0] = product.direction === 'Unidirectional' ? 'Anode' : 'Pin 1'
    pinLabels[1] = product.direction === 'Unidirectional' ? 'Cathode' : 'Pin 2'
  } else if (product.tags?.includes('array')) {
    // 阵列: 多 I/O 引脚
    for (let i = 0; i < dim.pins; i++) pinLabels[i] = `I/O ${i + 1}`
  } else {
    pinLabels[0] = 'GND'
    pinLabels[1] = 'I/O'
    for (let i = 2; i < dim.pins; i++) pinLabels[i] = `NC`
  }

  // 绘制主体 + 引脚号
  let pins = ''
  if (dim.pins === 2) {
    pins = `
      <rect x="${cx - 30}" y="${cy - 50}" width="60" height="100" rx="4" fill="#1F2937" stroke="${BRAND}" stroke-width="1.5"/>
      <text x="${cx - 30}" y="${cy + 60}" text-anchor="middle" font-size="11" fill="${BRAND}" font-weight="600">1</text>
      <text x="${cx + 30}" y="${cy + 60}" text-anchor="middle" font-size="11" fill="${BRAND}" font-weight="600">2</text>
      <text x="${cx - 30}" y="${cy + 80}" text-anchor="middle" font-size="10" fill="${GRAY}">${pinLabels[0]}</text>
      <text x="${cx + 30}" y="${cy + 80}" text-anchor="middle" font-size="10" fill="${GRAY}">${pinLabels[1]}</text>
    `
  } else {
    pins = `<rect x="${cx - 60}" y="${cy - 40}" width="120" height="80" rx="3" fill="#1F2937" stroke="${BRAND}" stroke-width="1.5"/>`
    const step = 120 / (dim.pins + 1)
    for (let i = 0; i < dim.pins; i++) {
      const x = cx - 60 + step * (i + 1)
      pins += `<text x="${x}" y="${cy + 65}" text-anchor="middle" font-size="10" fill="${BRAND}" font-weight="600">${i + 1}</text>`
      pins += `<text x="${x}" y="${cy + 80}" text-anchor="middle" font-size="9" fill="${GRAY}">${pinLabels[i] || 'NC'}</text>`
    }
  }

  return wrapSVG(`
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${BRAND}">${dim.name} - Pinout</text>
    ${pins}
    <text x="${W/2}" y="${H - 18}" text-anchor="middle" font-size="10" fill="${GRAY}">
      Direction: <tspan fill="${ACCENT}" font-weight="600">${product.direction}</tspan>
    </text>
  `, W, H)
}

/* ============================================================
 * 3. 典型应用电路 (Application Circuit)
 * 根据电压/封装自动选择
 * ============================================================ */
export function generateAppCircuit(product) {
  const W = 400, H = 300
  let circuit = ''

  if (product.tags?.includes('array')) {
    // USB / HDMI 多通道保护
    circuit = `
      <!-- USB Connector -->
      <rect x="50" y="80" width="60" height="140" rx="3" fill="#fff" stroke="${BRAND}" stroke-width="1.5"/>
      <text x="80" y="240" text-anchor="middle" font-size="10" fill="${BRAND}" font-weight="600">USB/HDMI</text>
      <text x="80" y="254" text-anchor="middle" font-size="8" fill="${GRAY}">Connector</text>
      <!-- 4 lines to ESD -->
      <line x1="110" y1="100" x2="200" y2="100" stroke="${GRAY}" stroke-width="1"/>
      <line x1="110" y1="130" x2="200" y2="130" stroke="${GRAY}" stroke-width="1"/>
      <line x1="110" y1="160" x2="200" y2="160" stroke="${GRAY}" stroke-width="1"/>
      <line x1="110" y1="190" x2="200" y2="190" stroke="${GRAY}" stroke-width="1"/>
      <!-- ESD Array chip -->
      <rect x="200" y="90" width="60" height="110" rx="3" fill="${BRAND}" stroke="${ACCENT}" stroke-width="1.5"/>
      <text x="230" y="150" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">ESD</text>
      <text x="230" y="162" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">Array</text>
      <!-- To GND -->
      <line x1="230" y1="200" x2="230" y2="240" stroke="${GRAY}" stroke-width="1"/>
      <line x1="210" y1="240" x2="250" y2="240" stroke="${GRAY}" stroke-width="1"/>
      <line x1="222" y1="246" x2="238" y2="246" stroke="${GRAY}" stroke-width="1"/>
      <line x1="226" y1="252" x2="234" y2="252" stroke="${GRAY}" stroke-width="1"/>
      <text x="230" y="270" text-anchor="middle" font-size="10" fill="${GRAY}">GND</text>
      <!-- Lines to MCU -->
      <line x1="260" y1="100" x2="340" y2="100" stroke="${GRAY}" stroke-width="1"/>
      <line x1="260" y1="130" x2="340" y2="130" stroke="${GRAY}" stroke-width="1"/>
      <line x1="260" y1="160" x2="340" y2="160" stroke="${GRAY}" stroke-width="1"/>
      <line x1="260" y1="190" x2="340" y2="190" stroke="${GRAY}" stroke-width="1"/>
      <rect x="340" y="80" width="40" height="140" rx="3" fill="#fff" stroke="${BRAND}" stroke-width="1.5"/>
      <text x="360" y="155" text-anchor="middle" font-size="10" fill="${BRAND}" font-weight="600">MCU</text>
    `
  } else {
    // 单通道: 信号线保护
    circuit = `
      <!-- Signal source -->
      <circle cx="60" cy="150" r="20" fill="#fff" stroke="${BRAND}" stroke-width="1.5"/>
      <text x="60" y="155" text-anchor="middle" font-size="10" fill="${BRAND}" font-weight="600">IN</text>
      <line x1="80" y1="150" x2="160" y2="150" stroke="${GRAY}" stroke-width="1.2"/>
      <text x="120" y="142" text-anchor="middle" font-size="9" fill="${GRAY}">Signal Line</text>
      <!-- ESD diode -->
      <rect x="160" y="120" width="80" height="60" rx="3" fill="${BRAND}" stroke="${ACCENT}" stroke-width="1.5"/>
      <text x="200" y="148" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${product.model}</text>
      <text x="200" y="162" text-anchor="middle" font-size="8" fill="#fff" opacity="0.85">${product.package}</text>
      <!-- GND -->
      <line x1="200" y1="180" x2="200" y2="220" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="180" y1="220" x2="220" y2="220" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="188" y1="226" x2="212" y2="226" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="194" y1="232" x2="206" y2="232" stroke="${GRAY}" stroke-width="1.2"/>
      <text x="200" y="252" text-anchor="middle" font-size="10" fill="${GRAY}">GND</text>
      <!-- To load -->
      <line x1="240" y1="150" x2="320" y2="150" stroke="${GRAY}" stroke-width="1.2"/>
      <rect x="320" y="130" width="40" height="40" rx="3" fill="#fff" stroke="${BRAND}" stroke-width="1.5"/>
      <text x="340" y="155" text-anchor="middle" font-size="10" fill="${BRAND}" font-weight="600">IC</text>
    `
  }

  return wrapSVG(`
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${BRAND}">Typical Application Circuit</text>
    ${circuit}
    <text x="${W/2}" y="${H - 8}" text-anchor="middle" font-size="9" fill="${GRAY}">
      VRWM ${product.vrwm} • Cj ${product.cj} • IPPM ${product.ippm}
    </text>
  `, W, H)
}

/* ============================================================
 * 4. 包装卷带 (Package Tape & Reel)
 * ============================================================ */
export function generatePackageTape(product) {
  const W = 400, H = 300
  const dim = PACKAGE_DIMS[product.package] || PACKAGE_DIMS['SOD323']
  const cx = W / 2, cy = H / 2

  // 7 段卷带 (单位 pixel)
  const segW = 50, segH = 40
  const startX = cx - (7 * segW) / 2
  let tape = ''
  for (let i = 0; i < 7; i++) {
    const x = startX + i * segW
    tape += `<rect x="${x}" y="${cy - segH/2}" width="${segW - 2}" height="${segH}" fill="#E0E7FF" stroke="${BRAND}" stroke-width="0.8"/>`
    // 圆孔
    tape += `<circle cx="${x + segW/2}" cy="${cy - 8}" r="3" fill="#fff" stroke="${GRAY}" stroke-width="0.5"/>`
    // 内部产品占位
    const innerW = dim.w * 12, innerH = dim.h * 12
    tape += `<rect x="${x + segW/2 - innerW/2}" y="${cy + 2}" width="${innerW}" height="${innerH}" fill="${BRAND}" opacity="0.7"/>`
  }
  // 顶部方向箭头
  tape += `<polygon points="${startX - 15},${cy} ${startX - 5},${cy - 6} ${startX - 5},${cy + 6}" fill="${ACCENT}"/>`
  tape += `<polygon points="${startX + 7*segW + 5},${cy} ${startX + 7*segW - 5},${cy - 6} ${startX + 7*segW - 5},${cy + 6}" fill="${ACCENT}"/>`
  // 卷盘外圈
  tape += `<rect x="${startX - 10}" y="${cy - segH/2 - 4}" width="${7 * segW + 20}" height="${segH + 8}" rx="5" fill="none" stroke="${GRAY}" stroke-width="0.6" stroke-dasharray="3,2"/>`

  return wrapSVG(`
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${BRAND}">Package: Tape &amp; Reel</text>
    ${tape}
    <text x="${W/2}" y="${cy - segH/2 - 16}" text-anchor="middle" font-size="9" fill="${GRAY}">Carrier Tape (top view)</text>
    <text x="${W/2}" y="${H - 50}" text-anchor="middle" font-size="11" fill="${BRAND}" font-weight="600">Quantity: ${product.packageQty}</text>
    <text x="${W/2}" y="${H - 32}" text-anchor="middle" font-size="9" fill="${GRAY}">Direction of feed ←—— →——</text>
    <text x="${W/2}" y="${H - 16}" text-anchor="middle" font-size="9" fill="${GRAY}">Complies with EIA-481</text>
  `, W, H)
}

/* ============================================================
 * 5. 电气特性曲线 (V-I Breakdown Curve)
 * ============================================================ */
export function generateSpecCurve(product) {
  const W = 400, H = 300
  // 曲线区域
  const px = 60, py = 50, pw = 320, ph = 200

  // 计算曲线 (指数 V-I 关系)
  const pts = []
  for (let i = 0; i <= 50; i++) {
    const t = i / 50
    // 电压从 VRWM 到 VBR 的指数曲线
    const v = product.cjValue > 1 ? 0.05 + Math.pow(t, 4) * 0.95 : 0.02 + Math.pow(t, 5) * 0.98
    const cur = Math.pow(t, 2.5)          // ⚠️ 改名: 不能用 const i 跟外层 for 的 let i 冲突
    pts.push([px + v * pw, py + ph - cur * ph])
  }
  const pathD = 'M ' + pts.map(p => p.join(' ')).join(' L ')

  // Cj-V 曲线 (电容随电压下降)
  const pts2 = []
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    const v = 0.05 + t * 0.95
    const c = Math.exp(-t * 2.5) * 0.9 + 0.1
    pts2.push([px + v * pw, py + 20 + c * (ph - 40)])
  }
  const path2D = 'M ' + pts2.map(p => p.join(' ')).join(' L ')

  return wrapSVG(`
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${BRAND}">Electrical Characteristics</text>

    <!-- Plot area -->
    <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#fff" stroke="${GRAY}" stroke-width="0.8"/>
    <!-- Grid -->
    ${[0.25, 0.5, 0.75].map(t => `<line x1="${px + t*pw}" y1="${py}" x2="${px + t*pw}" y2="${py+ph}" stroke="${LIGHT}" stroke-width="0.5"/>`).join('')}
    ${[0.25, 0.5, 0.75].map(t => `<line x1="${px}" y1="${py + t*ph}" x2="${px+pw}" y2="${py + t*ph}" stroke="${LIGHT}" stroke-width="0.5"/>`).join('')}

    <!-- VRWM threshold line -->
    <line x1="${px + 0.15*pw}" y1="${py}" x2="${px + 0.15*pw}" y2="${py+ph}" stroke="${ACCENT}" stroke-width="0.8" stroke-dasharray="3,2"/>
    <text x="${px + 0.15*pw + 3}" y="${py + 10}" font-size="8" fill="${ACCENT}">VRWM</text>

    <!-- V-I curve -->
    <path d="${pathD}" fill="none" stroke="${BRAND}" stroke-width="2"/>
    <text x="${px + pw - 5}" y="${py + 18}" text-anchor="end" font-size="9" fill="${BRAND}" font-weight="600">V-I Curve</text>

    <!-- Cj-V curve -->
    <path d="${path2D}" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="${px + pw - 5}" y="${py + 32}" text-anchor="end" font-size="9" fill="#10B981" font-weight="600">Cj-V Curve</text>

    <!-- Axes labels -->
    <text x="${px + pw/2}" y="${py + ph + 16}" text-anchor="middle" font-size="9" fill="${GRAY}">Voltage (V)</text>
    <text x="${px - 36}" y="${py + ph/2}" text-anchor="middle" font-size="9" fill="${GRAY}" transform="rotate(-90, ${px - 36}, ${py + ph/2})">Current / Capacitance</text>

    <!-- Key specs -->
    <text x="${W/2}" y="${H - 16}" text-anchor="middle" font-size="9" fill="${GRAY}">
      VRWM=${product.vrwm} • Cj=${product.cj} • IPPM=${product.ippm} • TYP
    </text>
  `, W, H)
}

/* ============================================================
 * 主入口: 为一个产品生成全部 5 张 SVG
 * ============================================================ */
export function generateAllImages(product) {
  return [
    { type: 'topView',     label: 'Top View',          svg: generateTopView(product) },
    { type: 'pinout',      label: 'Pinout',            svg: generatePinout(product) },
    { type: 'appCircuit',  label: 'Application',       svg: generateAppCircuit(product) },
    { type: 'packageTape', label: 'Package & Reel',    svg: generatePackageTape(product) },
    { type: 'specCurve',   label: 'Spec Curve',        svg: generateSpecCurve(product) }
  ]
}

// data URI 包装器 (用于 <img src="data:image/svg+xml,...">)
export function toDataURI(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
