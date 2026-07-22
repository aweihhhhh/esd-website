/**
 * SVG 产品图生成器 (v2 - 增强视觉差异)
 * ----------------------------------------------------------------------------
 * 为每个 ESD 防护二极管产品自动生成 5 张工业风示意图。
 * 每个图根据产品特性(封装/方向/低容/大电流/阵列)生成独特视觉:
 *   1. topView      - 俯视外形 (按封装尺寸 + 颜色编码家族)
 *   2. pinout       - 引脚定义 (按引脚数动态绘制)
 *   3. appCircuit   - 应用电路 (按特性展示不同场景)
 *   4. packageTape  - 卷盘包装 (颜色按封装家族)
 *   5. specCurve    - 特性曲线 (曲线形态因 cj/ippm 而异)
 * ----------------------------------------------------------------------------
 */

// ============= 封装尺寸 (mm) =============
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

// ============= 封装家族配色 =============
// 不同封装用不同色调, 让用户一眼能区分
const PACKAGE_COLORS = {
  'SOD923':     { bg: '#EEF4FB', body: '#0F3460', accent: '#3B82F6' },
  'SOD523':     { bg: '#F0F9F4', body: '#065F46', accent: '#10B981' },
  'SOD323':     { bg: '#FEF6EC', body: '#9A3412', accent: '#F97316' },
  'SOT363':     { bg: '#F4ECFB', body: '#6B21A8', accent: '#A855F7' },
  'SOT353':     { bg: '#FDF2F8', body: '#9D174D', accent: '#EC4899' },
  'SOT23-6L':   { bg: '#FEF2F2', body: '#991B1B', accent: '#EF4444' },
  'SOT23-5L':   { bg: '#FEF7EC', body: '#92400E', accent: '#F59E0B' },
  'SOT23':      { bg: '#F0FDFA', body: '#115E59', accent: '#14B8A6' },
  'SOT523':     { bg: '#ECFDF5', body: '#166534', accent: '#22C55E' },
  'SOT323':     { bg: '#F7FEE7', body: '#3F6212', accent: '#84CC16' },
  'DFN0603-2L': { bg: '#FAF5FF', body: '#581C87', accent: '#9333EA' },
  'DFN1006-2L': { bg: '#FFF1F2', body: '#9F1239', accent: '#E11D48' },
  'DFN1006-3L': { bg: '#F0F9FF', body: '#0C4A6E', accent: '#0284C7' },
  'DFN2510-10L':{ bg: '#FEFCE8', body: '#854D0E', accent: '#CA8A04' }
}

const GRAY = '#6B7280'
const LIGHT = '#E5E7EB'
const BRAND = '#0F3460'

// ============= 工具 =============
function wrapSVG(content, w = 400, h = 300) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${content}
  </svg>`
}

function getColors(product) {
  return PACKAGE_COLORS[product.package] || { bg: '#F9FAFB', body: '#1F2937', accent: '#0F3460' }
}

/* ============================================================
 * 1. 俯视图 - 封装 + 极性 + 型号水印
 * ============================================================ */
export function generateTopView(product) {
  const dim = PACKAGE_DIMS[product.package] || PACKAGE_DIMS['SOD323']
  const W = 400, H = 300
  const colors = getColors(product)
  const maxW = 260, maxH = 140
  const ratio = Math.min(maxW / dim.w, maxH / dim.h)
  const pw = dim.w * ratio, ph = dim.h * ratio
  const cx = W / 2, cy = H / 2 - 10

  // 极性标识符
  const polarity = product.direction === 'Bidirectional'
    ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="22" fill="#fff" font-weight="900">⇆</text>`
    : `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="20" fill="#fff" font-weight="900">▌▐</text>`

  // 主体形状 (按引脚数)
  let body
  if (dim.pins === 2) {
    body = `
      <rect x="${cx - pw/2}" y="${cy - ph/2}" width="${pw}" height="${ph}"
            rx="2" fill="${colors.body}" stroke="${colors.accent}" stroke-width="2"/>
      <rect x="${cx - pw/2 - 14}" y="${cy - 18}" width="14" height="36" fill="#D1D5DB" stroke="${GRAY}" stroke-width="0.5"/>
      <rect x="${cx + pw/2}"      y="${cy - 18}" width="14" height="36" fill="#D1D5DB" stroke="${GRAY}" stroke-width="0.5"/>
      <text x="${cx - pw/2 - 7}" y="${cy + 4}" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">1</text>
      <text x="${cx + pw/2 + 7}" y="${cy + 4}" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">2</text>
    `
  } else {
    body = `<rect x="${cx - pw/2}" y="${cy - ph/2}" width="${pw}" height="${ph}" rx="3" fill="${colors.body}" stroke="${colors.accent}" stroke-width="2"/>`
    const pinCount = dim.pins
    const spacing = pw / (pinCount + 1)
    for (let i = 0; i < pinCount; i++) {
      const x = cx - pw/2 + spacing * (i + 1) - 5
      body += `<rect x="${x}" y="${cy - ph/2 - 14}" width="10" height="14" fill="#D1D5DB" stroke="${GRAY}" stroke-width="0.5"/>`
      body += `<rect x="${x}" y="${cy + ph/2}"      width="10" height="14" fill="#D1D5DB" stroke="${GRAY}" stroke-width="0.5"/>`
    }
  }

  // 标签
  const tagColor = product.tags?.includes('lowCap') ? '#10B981'
                 : product.tags?.includes('highSurge') ? '#F59E0B'
                 : product.tags?.includes('array') ? '#A855F7'
                 : colors.accent
  const tagText = product.tags?.includes('lowCap') ? 'LOW CAP'
                : product.tags?.includes('highSurge') ? 'HIGH SURGE'
                : product.tags?.includes('array') ? 'ARRAY'
                : ''

  // 型号水印
  const watermark = `
    <text x="${W - 12}" y="${H - 10}" text-anchor="end" font-size="13" font-weight="800" fill="${colors.body}" opacity="0.18">${product.model}</text>
  `

  // 尺寸标注
  const dimLine = `
    <line x1="${cx - pw/2}" y1="${H - 38}" x2="${cx + pw/2}" y2="${H - 38}" stroke="${GRAY}" stroke-width="0.5"/>
    <line x1="${cx - pw/2}" y1="${H - 42}" x2="${cx - pw/2}" y2="${H - 34}" stroke="${GRAY}" stroke-width="0.5"/>
    <line x1="${cx + pw/2}" y1="${H - 42}" x2="${cx + pw/2}" y2="${H - 34}" stroke="${GRAY}" stroke-width="0.5"/>
    <text x="${cx}" y="${H - 22}" text-anchor="middle" font-size="11" fill="${GRAY}">${dim.w} × ${dim.h} mm</text>
  `

  return wrapSVG(`
    <rect width="${W}" height="${H}" fill="${colors.bg}"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${colors.body}">${dim.name} · Top View</text>
    ${body}
    ${polarity}
    <text x="20" y="22" font-size="10" font-weight="600" fill="${tagColor}">${tagText}</text>
    <text x="20" y="36" font-size="10" fill="${GRAY}">${product.direction}</text>
    ${dimLine}
    ${watermark}
  `, W, H)
}

/* ============================================================
 * 2. 引脚定义 - 动态引脚 + 极性标识
 * ============================================================ */
export function generatePinout(product) {
  const dim = PACKAGE_DIMS[product.package] || PACKAGE_DIMS['SOD323']
  const W = 400, H = 300
  const colors = getColors(product)
  const cx = W / 2, cy = H / 2 - 10

  // 引脚功能
  const pinLabels = []
  if (dim.pins === 2) {
    pinLabels[0] = product.direction === 'Unidirectional' ? 'Anode' : 'I/O 1'
    pinLabels[1] = product.direction === 'Unidirectional' ? 'Cathode' : 'I/O 2'
  } else if (product.tags?.includes('array')) {
    for (let i = 0; i < dim.pins; i++) pinLabels[i] = `I/O ${i + 1}`
  } else {
    pinLabels[0] = 'GND'
    pinLabels[1] = 'I/O'
    for (let i = 2; i < dim.pins; i++) pinLabels[i] = `NC`
  }

  let pins = ''
  if (dim.pins === 2) {
    pins = `
      <rect x="${cx - 30}" y="${cy - 50}" width="60" height="100" rx="4" fill="${colors.body}" stroke="${colors.accent}" stroke-width="2"/>
      <text x="${cx - 30}" y="${cy + 60}" text-anchor="middle" font-size="11" fill="${colors.accent}" font-weight="600">1</text>
      <text x="${cx + 30}" y="${cy + 60}" text-anchor="middle" font-size="11" fill="${colors.accent}" font-weight="600">2</text>
      <text x="${cx - 30}" y="${cy + 80}" text-anchor="middle" font-size="10" fill="${GRAY}">${pinLabels[0]}</text>
      <text x="${cx + 30}" y="${cy + 80}" text-anchor="middle" font-size="10" fill="${GRAY}">${pinLabels[1]}</text>
    `
  } else {
    pins = `<rect x="${cx - 60}" y="${cy - 40}" width="120" height="80" rx="3" fill="${colors.body}" stroke="${colors.accent}" stroke-width="2"/>`
    const step = 120 / (dim.pins + 1)
    for (let i = 0; i < dim.pins; i++) {
      const x = cx - 60 + step * (i + 1)
      pins += `<text x="${x}" y="${cy + 65}" text-anchor="middle" font-size="10" fill="${colors.accent}" font-weight="600">${i + 1}</text>`
      pins += `<text x="${x}" y="${cy + 80}" text-anchor="middle" font-size="9" fill="${GRAY}">${pinLabels[i] || 'NC'}</text>`
    }
  }

  return wrapSVG(`
    <rect width="${W}" height="${H}" fill="${colors.bg}"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${colors.body}">${dim.name} · Pinout</text>
    <text x="${W - 12}" y="22" text-anchor="end" font-size="11" font-weight="700" fill="${colors.body}" opacity="0.5">${product.model}</text>
    ${pins}
    <text x="${W/2}" y="${H - 18}" text-anchor="middle" font-size="10" fill="${GRAY}">
      Direction: <tspan fill="${colors.accent}" font-weight="600">${product.direction}</tspan>
    </text>
  `, W, H)
}

/* ============================================================
 * 3. 应用电路 - 根据特性展示不同场景
 * ============================================================ */
export function generateAppCircuit(product) {
  const W = 400, H = 300
  const colors = getColors(product)
  let circuit = ''

  // 根据产品特性选择不同的应用场景
  const isLowCap = product.tags?.includes('lowCap') || product.cjValue < 1
  const isHighSurge = product.tags?.includes('highSurge') || product.ippmValue >= 20
  const isArray = product.tags?.includes('array')

  if (isArray) {
    // 多通道保护
    circuit = `
      <rect x="50" y="80" width="60" height="140" rx="3" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="80" y="240" text-anchor="middle" font-size="10" fill="${colors.body}" font-weight="600">USB/HDMI</text>
      <text x="80" y="254" text-anchor="middle" font-size="8" fill="${GRAY}">Connector</text>
      ${[0,1,2,3].map(i => `<line x1="110" y1="${100 + i * 30}" x2="200" y2="${100 + i * 30}" stroke="${GRAY}" stroke-width="1"/>`).join('')}
      <rect x="200" y="90" width="60" height="110" rx="3" fill="${colors.body}" stroke="${colors.accent}" stroke-width="1.5"/>
      <text x="230" y="145" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">ESD</text>
      <text x="230" y="160" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">${product.model}</text>
      <line x1="230" y1="200" x2="230" y2="240" stroke="${GRAY}" stroke-width="1"/>
      <line x1="210" y1="240" x2="250" y2="240" stroke="${GRAY}" stroke-width="1"/>
      <line x1="222" y1="246" x2="238" y2="246" stroke="${GRAY}" stroke-width="1"/>
      <line x1="226" y1="252" x2="234" y2="252" stroke="${GRAY}" stroke-width="1"/>
      <text x="230" y="270" text-anchor="middle" font-size="10" fill="${GRAY}">GND</text>
      ${[0,1,2,3].map(i => `<line x1="260" y1="${100 + i * 30}" x2="340" y2="${100 + i * 30}" stroke="${GRAY}" stroke-width="1"/>`).join('')}
      <rect x="340" y="80" width="40" height="140" rx="3" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="360" y="155" text-anchor="middle" font-size="10" fill="${colors.body}" font-weight="600">SoC</text>
    `
  } else if (isLowCap) {
    // USB 3.0 / HDMI 高速数据线保护
    circuit = `
      <!-- USB Type-C connector -->
      <rect x="50" y="110" width="50" height="80" rx="3" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="75" y="155" text-anchor="middle" font-size="9" fill="${colors.body}" font-weight="700">USB-C</text>
      <!-- 2 高速差分对 (TX/RX) -->
      <line x1="100" y1="125" x2="170" y2="125" stroke="#3B82F6" stroke-width="1.2"/>
      <line x1="100" y1="135" x2="170" y2="135" stroke="#3B82F6" stroke-width="1.2"/>
      <line x1="100" y1="155" x2="170" y2="155" stroke="#10B981" stroke-width="1.2"/>
      <line x1="100" y1="165" x2="170" y2="165" stroke="#10B981" stroke-width="1.2"/>
      <text x="135" y="118" text-anchor="middle" font-size="8" fill="#3B82F6">TX+ / TX-</text>
      <text x="135" y="178" text-anchor="middle" font-size="8" fill="#10B981">RX+ / RX-</text>
      <!-- ESD chip -->
      <rect x="170" y="115" width="60" height="80" rx="3" fill="${colors.body}" stroke="${colors.accent}" stroke-width="1.5"/>
      <text x="200" y="148" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${product.model}</text>
      <text x="200" y="160" text-anchor="middle" font-size="7" fill="#fff" opacity="0.85">${product.cj}</text>
      <!-- GND -->
      <line x1="200" y1="195" x2="200" y2="230" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="180" y1="230" x2="220" y2="230" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="188" y1="236" x2="212" y2="236" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="194" y1="242" x2="206" y2="242" stroke="${GRAY}" stroke-width="1.2"/>
      <text x="200" y="260" text-anchor="middle" font-size="9" fill="${GRAY}">GND</text>
      <!-- To USB 3.0 Controller -->
      <line x1="230" y1="125" x2="300" y2="125" stroke="#3B82F6" stroke-width="1.2"/>
      <line x1="230" y1="135" x2="300" y2="135" stroke="#3B82F6" stroke-width="1.2"/>
      <line x1="230" y1="155" x2="300" y2="155" stroke="#10B981" stroke-width="1.2"/>
      <line x1="230" y1="165" x2="300" y2="165" stroke="#10B981" stroke-width="1.2"/>
      <rect x="300" y="115" width="50" height="80" rx="3" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="325" y="155" text-anchor="middle" font-size="9" fill="${colors.body}" font-weight="700">Host</text>
      <text x="325" y="167" text-anchor="middle" font-size="7" fill="${GRAY}">Controller</text>
    `
  } else if (isHighSurge) {
    // 工业 / 电源口保护
    circuit = `
      <!-- Power input -->
      <rect x="40" y="100" width="60" height="100" rx="3" fill="#fff" stroke="#9A3412" stroke-width="1.5"/>
      <text x="70" y="148" text-anchor="middle" font-size="10" fill="#9A3412" font-weight="700">DC</text>
      <text x="70" y="162" text-anchor="middle" font-size="10" fill="#9A3412" font-weight="700">${product.vrwm}</text>
      <text x="70" y="174" text-anchor="middle" font-size="8" fill="${GRAY}">Input</text>
      <!-- 12V / 24V lines -->
      <line x1="100" y1="125" x2="180" y2="125" stroke="#9A3412" stroke-width="1.5"/>
      <line x1="100" y1="175" x2="180" y2="175" stroke="#1F2937" stroke-width="1.5"/>
      <text x="140" y="118" text-anchor="middle" font-size="8" fill="#9A3412" font-weight="600">V+</text>
      <text x="140" y="188" text-anchor="middle" font-size="8" fill="#1F2937" font-weight="600">GND</text>
      <!-- Big TVS diode symbol -->
      <rect x="180" y="100" width="80" height="100" rx="4" fill="${colors.body}" stroke="${colors.accent}" stroke-width="2"/>
      <text x="220" y="140" text-anchor="middle" font-size="14" fill="#fff" font-weight="900">${product.model}</text>
      <text x="220" y="155" text-anchor="middle" font-size="9" fill="#fff" opacity="0.9">${product.direction}</text>
      <text x="220" y="170" text-anchor="middle" font-size="9" fill="${colors.accent}" font-weight="700">IPPM ${product.ippm}</text>
      <text x="220" y="183" text-anchor="middle" font-size="8" fill="#fff" opacity="0.8">VRWM ${product.vrwm}</text>
      <!-- Industrial load -->
      <line x1="260" y1="125" x2="320" y2="125" stroke="#9A3412" stroke-width="1.5"/>
      <line x1="260" y1="175" x2="320" y2="175" stroke="#1F2937" stroke-width="1.5"/>
      <rect x="320" y="100" width="50" height="100" rx="3" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="345" y="148" text-anchor="middle" font-size="10" fill="${colors.body}" font-weight="700">PLB</text>
      <text x="345" y="160" text-anchor="middle" font-size="7" fill="${GRAY}">Industrial</text>
    `
  } else {
    // 标准通用电路
    circuit = `
      <circle cx="60" cy="150" r="20" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="60" y="155" text-anchor="middle" font-size="10" fill="${colors.body}" font-weight="600">IN</text>
      <line x1="80" y1="150" x2="160" y2="150" stroke="${GRAY}" stroke-width="1.2"/>
      <text x="120" y="142" text-anchor="middle" font-size="9" fill="${GRAY}">${product.vrwm} signal</text>
      <rect x="160" y="120" width="80" height="60" rx="3" fill="${colors.body}" stroke="${colors.accent}" stroke-width="1.5"/>
      <text x="200" y="148" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${product.model}</text>
      <text x="200" y="162" text-anchor="middle" font-size="8" fill="#fff" opacity="0.85">${product.cj} · ${product.ippm}</text>
      <line x1="200" y1="180" x2="200" y2="220" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="180" y1="220" x2="220" y2="220" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="188" y1="226" x2="212" y2="226" stroke="${GRAY}" stroke-width="1.2"/>
      <line x1="194" y1="232" x2="206" y2="232" stroke="${GRAY}" stroke-width="1.2"/>
      <text x="200" y="252" text-anchor="middle" font-size="10" fill="${GRAY}">GND</text>
      <line x1="240" y1="150" x2="320" y2="150" stroke="${GRAY}" stroke-width="1.2"/>
      <rect x="320" y="130" width="40" height="40" rx="3" fill="#fff" stroke="${colors.body}" stroke-width="1.5"/>
      <text x="340" y="155" text-anchor="middle" font-size="10" fill="${colors.body}" font-weight="600">IC</text>
    `
  }

  return wrapSVG(`
    <rect width="${W}" height="${H}" fill="${colors.bg}"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${colors.body}">
      ${isArray ? 'Multi-line ESD' : isLowCap ? 'High-Speed Data Line' : isHighSurge ? 'Power Input Protection' : 'Typical Application'}
    </text>
    <text x="${W - 12}" y="22" text-anchor="end" font-size="11" font-weight="700" fill="${colors.body}" opacity="0.5">${product.model}</text>
    ${circuit}
    <text x="${W/2}" y="${H - 8}" text-anchor="middle" font-size="9" fill="${GRAY}">
      VRWM ${product.vrwm} • Cj ${product.cj} • IPPM ${product.ippm}
    </text>
  `, W, H)
}

/* ============================================================
 * 4. 卷盘包装 - 按封装家族配色 + 型号
 * ============================================================ */
export function generatePackageTape(product) {
  const W = 400, H = 300
  const dim = PACKAGE_DIMS[product.package] || PACKAGE_DIMS['SOD323']
  const colors = getColors(product)
  const cx = W / 2, cy = H / 2

  // 7 段卷带
  const segW = 50, segH = 40
  const startX = cx - (7 * segW) / 2
  let tape = ''
  for (let i = 0; i < 7; i++) {
    const x = startX + i * segW
    tape += `<rect x="${x}" y="${cy - segH/2}" width="${segW - 2}" height="${segH}" fill="${colors.bg}" stroke="${colors.body}" stroke-width="0.8"/>`
    // 圆孔
    tape += `<circle cx="${x + segW/2}" cy="${cy - 8}" r="3" fill="#fff" stroke="${GRAY}" stroke-width="0.5"/>`
    // 内部产品占位 (按尺寸缩放)
    const innerW = Math.max(8, dim.w * 14)
    const innerH = Math.max(5, dim.h * 14)
    tape += `<rect x="${x + segW/2 - innerW/2}" y="${cy + 2}" width="${innerW}" height="${innerH}" fill="${colors.body}" opacity="0.85" rx="1"/>`
  }
  // 方向箭头
  tape += `<polygon points="${startX - 15},${cy} ${startX - 5},${cy - 6} ${startX - 5},${cy + 6}" fill="${colors.accent}"/>`
  tape += `<polygon points="${startX + 7*segW + 5},${cy} ${startX + 7*segW - 5},${cy - 6} ${startX + 7*segW - 5},${cy + 6}" fill="${colors.accent}"/>`
  // 外圈
  tape += `<rect x="${startX - 10}" y="${cy - segH/2 - 4}" width="${7 * segW + 20}" height="${segH + 8}" rx="5" fill="none" stroke="${GRAY}" stroke-width="0.6" stroke-dasharray="3,2"/>`

  return wrapSVG(`
    <rect width="${W}" height="${H}" fill="${colors.bg}"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${colors.body}">Tape &amp; Reel · ${dim.name}</text>
    <text x="${W/2}" y="36" text-anchor="middle" font-size="11" font-weight="600" fill="${colors.accent}">${product.model}</text>
    ${tape}
    <text x="${W/2}" y="${cy - segH/2 - 14}" text-anchor="middle" font-size="9" fill="${GRAY}">Carrier Tape (top view)</text>
    <text x="${W/2}" y="${H - 50}" text-anchor="middle" font-size="12" fill="${colors.body}" font-weight="700">${product.packageQty}</text>
    <text x="${W/2}" y="${H - 32}" text-anchor="middle" font-size="9" fill="${GRAY}">Direction of feed ←—— →——</text>
    <text x="${W/2}" y="${H - 16}" text-anchor="middle" font-size="9" fill="${GRAY}">Complies with EIA-481</text>
  `, W, H)
}

/* ============================================================
 * 5. 特性曲线 - 因 cj/ippm 不同而形态不同
 * ============================================================ */
export function generateSpecCurve(product) {
  const W = 400, H = 300
  const colors = getColors(product)
  const px = 60, py = 50, pw = 320, ph = 200

  // V-I 曲线 (指数, 形态因 cj 变化)
  const pts = []
  const expV = product.cjValue < 1 ? 5 : product.cjValue < 5 ? 4 : 3
  const expI = product.ippmValue > 20 ? 2 : product.ippmValue > 10 ? 2.5 : 3
  for (let i = 0; i <= 50; i++) {
    const t = i / 50
    const v = 0.05 + Math.pow(t, expV) * 0.95
    const cur = Math.pow(t, expI)
    pts.push([px + v * pw, py + ph - cur * ph])
  }
  const pathD = 'M ' + pts.map(p => p.join(' ')).join(' L ')

  // Cj-V 曲线
  const pts2 = []
  const decayRate = product.cjValue < 1 ? 3.5 : 2.5
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    const v = 0.05 + t * 0.95
    const c = Math.exp(-t * decayRate) * 0.9 + 0.1
    pts2.push([px + v * pw, py + 20 + c * (ph - 40)])
  }
  const path2D = 'M ' + pts2.map(p => p.join(' ')).join(' L ')

  // 阈值线位置
  const vrwmRatio = Math.min(0.4, (parseFloat(product.vrwm) || 5) / 36 * 0.4 + 0.1)

  return wrapSVG(`
    <rect width="${W}" height="${H}" fill="${colors.bg}"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="${colors.body}">Electrical Characteristics</text>
    <text x="${W - 12}" y="22" text-anchor="end" font-size="11" font-weight="700" fill="${colors.body}" opacity="0.5">${product.model}</text>

    <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#fff" stroke="${GRAY}" stroke-width="0.8"/>
    ${[0.25, 0.5, 0.75].map(t => `<line x1="${px + t*pw}" y1="${py}" x2="${px + t*pw}" y2="${py+ph}" stroke="${LIGHT}" stroke-width="0.5"/>`).join('')}
    ${[0.25, 0.5, 0.75].map(t => `<line x1="${px}" y1="${py + t*ph}" x2="${px+pw}" y2="${py + t*ph}" stroke="${LIGHT}" stroke-width="0.5"/>`).join('')}

    <line x1="${px + vrwmRatio*pw}" y1="${py}" x2="${px + vrwmRatio*pw}" y2="${py+ph}" stroke="${colors.accent}" stroke-width="0.8" stroke-dasharray="3,2"/>
    <text x="${px + vrwmRatio*pw + 3}" y="${py + 10}" font-size="8" fill="${colors.accent}" font-weight="600">VRWM ${product.vrwm}</text>

    <path d="${pathD}" fill="none" stroke="${colors.body}" stroke-width="2"/>
    <text x="${px + pw - 5}" y="${py + 18}" text-anchor="end" font-size="9" fill="${colors.body}" font-weight="600">V-I Curve</text>

    <path d="${path2D}" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="${px + pw - 5}" y="${py + 32}" text-anchor="end" font-size="9" fill="#10B981" font-weight="600">Cj-V Curve</text>

    <text x="${px + pw/2}" y="${py + ph + 16}" text-anchor="middle" font-size="9" fill="${GRAY}">Voltage (V)</text>
    <text x="${px - 36}" y="${py + ph/2}" text-anchor="middle" font-size="9" fill="${GRAY}" transform="rotate(-90, ${px - 36}, ${py + ph/2})">Current / Capacitance</text>

    <text x="${W/2}" y="${H - 16}" text-anchor="middle" font-size="9" fill="${GRAY}">
      VRWM ${product.vrwm} • Cj ${product.cj} • IPPM ${product.ippm}
    </text>
  `, W, H)
}

/* ============================================================
 * 主入口
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

export function toDataURI(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
