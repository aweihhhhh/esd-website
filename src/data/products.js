/**
 * ESD Protection Diode 产品数据源
 * ----------------------------------------------------------------------------
 * 源文档：ESD 产品目录（8 页，共约 200+ 型号）
 * 字段说明：
 *   id          - 路由 slug，唯一
 *   model       - 典型流通型号 (Part Number)
 *   package     - 封装尺寸 (Package)
 *   category    - 品类 (固定 ESD)
 *   direction   - 极性 (Unidirectional / Bidirectional)
 *   vrwm        - 工作电压原始字符串 (例: "5V" / "7V+12V" / "5V-36V")
 *   vrwmMin     - 数值化最低电压 (V)，用于筛选
 *   vrwmMax     - 数值化最高电压 (V)，用于复合电压筛选
 *   vrwmDisplay - 列表页展示电压
 *   cj          - 结电容原始字符串 (例: "0.5PF")
 *   cjValue     - 数值化结电容 (pF)
 *   ippm        - 最大脉冲电流原始字符串 (例: "11A" / "18A+18A")
 *   ippmValue   - 数值化主电流 (A)
 *   packageQty  - 卷盘包装 (例: "3K/盘" / "10K/盘 可定制15K/盘")
 *   tags        - 标签 (lowCap / highSurge / array)
 *   summary     - 简短英文描述
 *   applications- 典型应用
 * ----------------------------------------------------------------------------
 */

const slug = (pkg, model) => `${pkg}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// 公共应用场景文案（按电压区间）
const appByVoltage = {
  low:   'USB 2.0/3.0, HDMI, high-speed data lines, mobile phones, charging ports',
  mid:   'Smart wearables, IoT devices, consumer electronics, battery management',
  high:  'Industrial control, automotive electronics, power supplies, 12V/24V systems',
  array: 'Multi-line ESD protection, USB hubs, Ethernet, portable devices'
}

// ==================== SOD923 (8 款) ====================
const sod923 = [
  { model: 'ESD9X3.3',  direction: 'Unidirectional', vrwm: '3.3V',  vrwmMin: 3.3,  vrwmMax: 3.3,  cj: '70PF',  cjValue: 70,  ippm: '11A', ippmValue: 11,  packageQty: '8K/reel' },
  { model: 'ESD9L5.0',  direction: 'Unidirectional', vrwm: '5V',    vrwmMin: 5,    vrwmMax: 5,    cj: '0.5PF', cjValue: 0.5, ippm: '4A',  ippmValue: 4,   packageQty: '8K/reel', tags:['lowCap'] },
  { model: 'ESD9X5.0',  direction: 'Unidirectional', vrwm: '5V',    vrwmMin: 5,    vrwmMax: 5,    cj: '80PF',  cjValue: 80,  ippm: '12A', ippmValue: 12,  packageQty: '8K/reel' },
  { model: 'ESD9X7.0',  direction: 'Unidirectional', vrwm: '7V',    vrwmMin: 7,    vrwmMax: 7,    cj: '70PF',  cjValue: 70,  ippm: '10A', ippmValue: 10,  packageQty: '8K/reel' },
  { model: 'ESD9X12',   direction: 'Unidirectional', vrwm: '12V',   vrwmMin: 12,   vrwmMax: 12,   cj: '55PF',  cjValue: 55,  ippm: '12A', ippmValue: 12,  packageQty: '8K/reel' },
  { model: 'ESD9D3.3C', direction: 'Bidirectional',  vrwm: '3.3V',  vrwmMin: 3.3,  vrwmMax: 3.3,  cj: '15PF',  cjValue: 15,  ippm: '9A',  ippmValue: 9,   packageQty: '8K/reel' },
  { model: 'ESD9D5.0C', direction: 'Bidirectional',  vrwm: '5V',    vrwmMin: 5,    vrwmMax: 5,    cj: '15PF',  cjValue: 15,  ippm: '9A',  ippmValue: 9,   packageQty: '8K/reel' },
  { model: 'ESD9L5.0C', direction: 'Bidirectional',  vrwm: '5V',    vrwmMin: 5,    vrwmMax: 5,    cj: '0.6PF', cjValue: 0.6, ippm: '3A',  ippmValue: 3,   packageQty: '8K/reel', tags:['lowCap'] }
].map(p => ({ id: slug('SOD923', p.model), package: 'SOD923', category: 'ESD', ...p }))

// ==================== SOD523 (39 款) ====================
const sod523Raw = [
  // Unidirectional
  ['ESD5Z3.3',  'Unidirectional', '3.3V', 3.3, 3.3,  '70PF',  70,  '11A',  11,  '3K/reel'],
  ['ESD5Z5.0',  'Unidirectional', '5V',   5,   5,    '60PF',  60,  '9A',   9,   '3K/reel'],
  ['ESD5B5.0',  'Unidirectional', '5V',   5,   5,    '140PF', 140, '20A',  20,  '3K/reel', ['highSurge']],
  ['ESD5Z7.0',  'Unidirectional', '7V',   7,   7,    '40PF',  40,  '9A',   9,   '3K/reel'],
  ['ESD5Z12',   'Unidirectional', '12V',  12,  12,   '46PF',  46,  '9A',   9,   '3K/reel'],
  ['ESD5B7.0',  'Unidirectional', '12V',  12,  12,   '60PF',  60,  '12A',  12,  '3K/reel'],
  ['ESD5D12',   'Unidirectional', '12V',  12,  12,   '55PF',  55,  '6A',   6,   '3K/reel'],
  ['ESD5Z24',   'Unidirectional', '24V',  24,  24,   '25PF',  25,  '6A',   6,   '3K/reel'],
  ['ESD5Z36',   'Unidirectional', '36V',  36,  36,   '28PF',  28,  '6A',   6,   '3K/reel'],
  ['ESD5L3.3',  'Unidirectional', '3.3V', 3.3, 3.3,  '0.4PF', 0.4, '4A',   4,   '3K/reel', ['lowCap']],
  ['ESD5U5.0',  'Unidirectional', '5V',   5,   5,    '0.5PF', 0.5, '4A',   4,   '3K/reel', ['lowCap']],
  ['ESD5S5.0',  'Unidirectional', '5V',   5,   5,    '80PF',  80,  '11A',  11,  '3K/reel'],
  ['ESD5S7.0',  'Unidirectional', '7V',   7,   7,    '70PF',  70,  '10A',  10,  '3K/reel'],
  ['ESD5S12',   'Unidirectional', '12V',  12,  12,   '35PF',  35,  '7A',   7,   '3K/reel'],
  ['ESD5S15',   'Unidirectional', '15V',  15,  15,   '30PF',  30,  '5A',   5,   '3K/reel'],
  ['ESD5S24',   'Unidirectional', '24V',  24,  24,   '20PF',  20,  '4A',   4,   '3K/reel'],
  ['ESD5S36',   'Unidirectional', '36V',  36,  36,   '12PF',  12,  '3A',   3,   '3K/reel'],
  // Bidirectional
  ['ESD5Z3.3C', 'Bidirectional',  '3.3V', 3.3, 3.3,  '15PF',  15,  '9A',   9,   '3K/reel'],
  ['ESD5N3.3C', 'Bidirectional',  '3.3V', 3.3, 3.3,  '30PF',  30,  '20A',  20,  '3K/reel', ['highSurge']],
  ['ESD5L5.0C', 'Bidirectional',  '5V',   5,   5,    '0.6PF', 0.6, '3A',   3,   '3K/reel', ['lowCap']],
  ['ESD5LL5.0C','Bidirectional',  '5V',   5,   5,    '0.35PF',0.35,'4A',   4,   '3K/reel', ['lowCap']],
  ['ESD5LM5.0C','Bidirectional',  '5V',   5,   5,    '2.5PF', 2.5, '2.5A', 2.5, '3K/reel', ['lowCap']],
  ['ESD5LM5.0CS','Bidirectional', '5V',   5,   5,    '2.8PF', 2.8, '3.5A', 3.5, '3K/reel', ['lowCap']],
  ['ESD5D5.0C', 'Bidirectional',  '5V',   5,   5,    '8PF',   8,   '5A',   5,   '3K/reel'],
  ['ESD5S5.0C', 'Bidirectional',  '5V',   5,   5,    '10PF',  10,  '6A',   6,   '3K/reel'],
  ['ESD5Z5.0C', 'Bidirectional',  '5V',   5,   5,    '15PF',  15,  '9A',   9,   '3K/reel'],
  ['ESD5Z5.0CB','Bidirectional',  '5V',   5,   5,    '20PF',  20,  '11A',  11,  '3K/reel'],
  ['ESD5N5.0C', 'Bidirectional',  '5V',   5,   5,    '30PF',  30,  '20A',  20,  '3K/reel', ['highSurge']],
  ['ESD5B5.0C', 'Bidirectional',  '5V',   5,   5,    '60PF',  60,  '30A',  30,  '3K/reel', ['highSurge']],
  ['ESD5Z7.0C', 'Bidirectional',  '7V',   7,   7,    '8PF',   8,   '9A',   9,   '3K/reel'],
  ['ESD5E7.0C', 'Bidirectional',  '7V',   7,   7,    '17PF',  17,  '8A',   8,   '3K/reel'],
  ['ESD5B7.0C', 'Bidirectional',  '7V',   7,   7,    '15PF',  15,  '20A',  20,  '3K/reel', ['highSurge']],
  ['ESD5Z12C',  'Bidirectional',  '12V',  12,  12,   '8PF',   8,   '9A',   9,   '3K/reel'],
  ['ESD5L12C',  'Bidirectional',  '12V',  12,  12,   '0.3PF', 0.3, '2A',   2,   '3K/reel', ['lowCap']],
  ['ESD5Z15CS', 'Bidirectional',  '15V',  15,  15,   '15PF',  15,  '5A',   5,   '3K/reel'],
  ['ESD5Z24C',  'Bidirectional',  '24V',  24,  24,   '30PF',  30,  '9A',   9,   '3K/reel'],
  ['ESD5Z24CS', 'Bidirectional',  '24V',  24,  24,   '10PF',  10,  '4A',   4,   '3K/reel'],
  ['ESD5Z36C',  'Bidirectional',  '36V',  36,  36,   '22PF',  22,  '8A',   8,   '3K/reel'],
  ['ESD5Z36CS', 'Bidirectional',  '36V',  36,  36,   '15PF',  15,  '4A',   4,   '3K/reel']
]
const sod523 = sod523Raw.map(([model, direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags = []]) => ({
  id: slug('SOD523', model), model, package: 'SOD523', category: 'ESD', direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags
}))

// ==================== SOD323 (66 款) ====================
const sod323Raw = [
  // Unidirectional
  ['SD03',     'Unidirectional', '3.3V',  3.3, 3.3,  '140PF', 140, '22A',  22,  '3K/reel', ['highSurge']],
  ['ESD3A4V5', 'Unidirectional', '4.5V',  4.5, 4.5,  '780PF', 780, '120A', 120, '3K/reel', ['highSurge']],
  ['ESD3B4V5', 'Unidirectional', '4.5V',  4.5, 4.5,  '450PF', 450, '170A', 170, '3K/reel', ['highSurge']],
  ['ESD3L5.0', 'Unidirectional', '5V',    5,   5,    '0.5PF', 0.5, '4A',   4,   '3K/reel', ['lowCap']],
  ['ESD3Z5.0', 'Unidirectional', '5V',    5,   5,    '60PF',  60,  '11A',  11,  '3K/reel'],
  ['GBLC03',   'Unidirectional', '3.3V',  3.3, 3.3,  '0.6PF', 0.6, '20A',  20,  '3K/reel', ['lowCap','highSurge']],
  ['GBLC05',   'Unidirectional', '5V',    5,   5,    '0.6PF', 0.6, '20A',  20,  '3K/reel', ['lowCap','highSurge']],
  ['SD05',     'Unidirectional', '5V',    5,   5,    '180PF', 180, '25A',  25,  '3K/reel', ['highSurge']],
  ['SD07',     'Unidirectional', '7V',    7,   7,    '120PF', 120, '18A',  18,  '3K/reel', ['highSurge']],
  ['SD12S',    'Unidirectional', '12V',   12,  12,   '60PF',  60,  '10A',  10,  '3K/reel'],
  ['SD12',     'Unidirectional', '12V',   12,  12,   '80PF',  80,  '15A',  15,  '3K/reel'],
  ['SD15',     'Unidirectional', '15V',   15,  15,   '55PF',  55,  '9A',   9,   '3K/reel'],
  ['SD15D',    'Unidirectional', '15V',   15,  15,   '70PF',  70,  '12A',  12,  '3K/reel'],
  ['SD18',     'Unidirectional', '18V',   18,  18,   '50PF',  50,  '10A',  10,  '3K/reel'],
  ['SD20',     'Unidirectional', '20V',   20,  20,   '50PF',  50,  '8A',   8,   '3K/reel'],
  ['SD24',     'Unidirectional', '24V',   24,  24,   '25PF',  25,  '6A',   6,   '3K/reel'],
  ['SD24JB',   'Unidirectional', '24V',   24,  24,   '40PF',  40,  '9A',   9,   '3K/reel'],
  ['SD27',     'Unidirectional', '27V',   27,  27,   '28PF',  28,  '4A',   4,   '3K/reel'],
  ['SD30',     'Unidirectional', '30V',   30,  30,   '35PF',  35,  '7A',   7,   '3K/reel'],
  ['SD36S',    'Unidirectional', '36V',   36,  36,   '12PF',  12,  '3.5A', 3.5, '3K/reel'],
  ['SD36',     'Unidirectional', '36V',   36,  36,   '30PF',  30,  '7A',   7,   '3K/reel'],
  // Bidirectional
  ['GBLC03CS', 'Bidirectional',  '3.3V',  3.3, 3.3,  '0.6PF', 0.6, '10A',  10,  '3K/reel', ['lowCap']],
  ['GBLC03C',  'Bidirectional',  '3.3V',  3.3, 3.3,  '0.6PF', 0.6, '20A',  20,  '3K/reel', ['lowCap','highSurge']],
  ['ESD3Z3.3C','Bidirectional',  '3.3V',  3.3, 3.3,  '20PF',  20,  '11A',  11,  '3K/reel'],
  ['SD03CS',   'Bidirectional',  '3.3V',  3.3, 3.3,  '30PF',  30,  '20A',  20,  '3K/reel', ['highSurge']],
  ['SD03C',    'Bidirectional',  '3.3V',  3.3, 3.3,  '70PF',  70,  '35A',  35,  '3K/reel', ['highSurge']],
  ['ESD3LL5.0C','Bidirectional', '5V',    5,   5,    '0.35PF',0.35,'4A',   4,   '3K/reel', ['lowCap']],
  ['GBLC05CS', 'Bidirectional',  '5V',    5,   5,    '0.6PF', 0.6, '10A',  10,  '3K/reel', ['lowCap']],
  ['GBLC05C',  'Bidirectional',  '5V',    5,   5,    '0.6PF', 0.6, '18A',  18,  '3K/reel', ['lowCap','highSurge']],
  ['ESD3LM5.0C','Bidirectional', '5V',    5,   5,    '2.5PF', 2.5, '2.5A', 2.5, '3K/reel', ['lowCap']],
  ['ESD3Z5.0C','Bidirectional',  '5V',    5,   5,    '20PF',  20,  '11A',  11,  '3K/reel'],
  ['SD05CS',   'Bidirectional',  '5V',    5,   5,    '30PF',  30,  '18A',  18,  '3K/reel', ['highSurge']],
  ['SD05C',    'Bidirectional',  '5V',    5,   5,    '60PF',  60,  '30A',  30,  '3K/reel', ['highSurge']],
  ['SD07CS',   'Bidirectional',  '7V',    7,   7,    '15PF',  15,  '20A',  20,  '3K/reel', ['highSurge']],
  ['ESD3Z8.0C','Bidirectional',  '8V',    8,   8,    '8PF',   8,   '9A',   9,   '3K/reel'],
  ['SD08CS',   'Bidirectional',  '8V',    8,   8,    '15PF',  15,  '20A',  20,  '3K/reel', ['highSurge']],
  ['SD08C',    'Bidirectional',  '8V',    8,   8,    '35PF',  35,  '35A',  35,  '3K/reel', ['highSurge']],
  ['GBLC12CB', 'Bidirectional',  '12V',   12,  12,   '0.6PF', 0.6, '16A',  16,  '3K/reel', ['lowCap','highSurge']],
  ['SD12CB',   'Bidirectional',  '12V',   12,  12,   '8PF',   8,   '9A',   9,   '3K/reel'],
  ['SD12C',    'Bidirectional',  '12V',   12,  12,   '10PF',  10,  '11A',  11,  '3K/reel'],
  ['SD12CC',   'Bidirectional',  '12V',   12,  12,   '15PF',  15,  '18A',  18,  '3K/reel', ['highSurge']],
  ['GBLC15CB', 'Bidirectional',  '15V',   15,  15,   '0.6PF', 0.6, '11A',  11,  '3K/reel', ['lowCap']],
  ['SD15CS',   'Bidirectional',  '15V',   15,  15,   '15PF',  15,  '5A',   5,   '3K/reel'],
  ['SD15C',    'Bidirectional',  '15V',   15,  15,   '20PF',  20,  '8A',   8,   '3K/reel'],
  ['SD15CC',   'Bidirectional',  '15V',   15,  15,   '35PF',  35,  '13A',  13,  '3K/reel'],
  ['GBLC18CB', 'Bidirectional',  '18V',   18,  18,   '0.6PF', 0.6, '10A',  10,  '3K/reel', ['lowCap']],
  ['SD18C',    'Bidirectional',  '18V',   18,  18,   '25PF',  25,  '10A',  10,  '3K/reel'],
  ['GBLC24CB', 'Bidirectional',  '24V',   24,  24,   '0.6PF', 0.6, '8A',   8,   '3K/reel', ['lowCap']],
  ['SD24CS',   'Bidirectional',  '24V',   24,  24,   '10PF',  10,  '4A',   4,   '3K/reel'],
  ['SD24C',    'Bidirectional',  '24V',   24,  24,   '15PF',  15,  '6A',   6,   '3K/reel'],
  ['SD24CC',   'Bidirectional',  '24V',   24,  24,   '30PF',  30,  '9A',   9,   '3K/reel'],
  ['SD27C',    'Bidirectional',  '27V',   27,  27,   '15PF',  15,  '4A',   4,   '3K/reel'],
  ['SD30C',    'Bidirectional',  '30V',   30,  30,   '10PF',  10,  '7A',   7,   '3K/reel'],
  ['SD36CS',   'Bidirectional',  '36V',   36,  36,   '6PF',   6,   '3A',   3,   '3K/reel'],
  ['SD36C',    'Bidirectional',  '36V',   36,  36,   '15PF',  15,  '6A',   6,   '3K/reel'],
  ['SD36CC',   'Bidirectional',  '36V',   36,  36,   '22PF',  22,  '8A',   8,   '3K/reel'],
  ['GBLC36C',  'Bidirectional',  '36V',   36,  36,   '0.6PF', 0.6, '6A',   6,   '3K/reel', ['lowCap']],
  ['SD48C',    'Bidirectional',  '48V',   48,  48,   '15PF',  15,  '9A',   9,   '3K/reel'],
  ['SD48CB',   'Bidirectional',  '48V',   48,  48,   '10PF',  10,  '6A',   6,   '3K/reel'],
  // Array / multi-line
  ['PESD1LIN', 'Bidirectional',  '15V+24V', 15, 24,  '10PF',  10,  '4A',   4,   '3K/reel', ['array']],
  ['ESD712BB', 'Bidirectional',  '7V+12V',  7,  12,   '25PF',  25,  '18A+18A', 18, '3K/reel', ['array','highSurge']]
]
const sod323 = sod323Raw.map(([model, direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags = []]) => ({
  id: slug('SOD323', model), model, package: 'SOD323', category: 'ESD', direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags
}))

// ==================== SOT363 (3 款) ====================
const sot363 = [
  { model: 'ESD0504F', direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.6PF', cjValue: 0.6, ippm: '4A',  ippmValue: 4,  packageQty: '3K/reel', tags:['lowCap','array'] },
  { model: 'SMF05C',  direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '30PF',  cjValue: 30,  ippm: '5A',  ippmValue: 5,  packageQty: '3K/reel', tags:['array'] },
  { model: 'SMF05CD', direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '80PF',  cjValue: 80,  ippm: '11A', ippmValue: 11, packageQty: '3K/reel', tags:['array'] }
].map(p => ({ id: slug('SOT363', p.model), package: 'SOT363', category: 'ESD', ...p }))

// ==================== SOT353 (1 款) ====================
const sot353 = [
  { model: 'SMF05', direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '30PF', cjValue: 30, ippm: '5A', ippmValue: 5, packageQty: '3K/reel', tags:['array'] }
].map(p => ({ id: slug('SOT353', p.model), package: 'SOT353', category: 'ESD', ...p }))

// ==================== SOT23-6L (4 款) ====================
const sot236L = [
  { model: 'SRV05-4',       direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.6PF', cjValue: 0.6, ippm: '4A', ippmValue: 4, packageQty: '3K/reel', tags:['lowCap','array'] },
  { model: 'ESD0504SS',     direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.5PF', cjValue: 0.5, ippm: '4A', ippmValue: 4, packageQty: '3K/reel', tags:['lowCap','array'] },
  { model: 'USBLC6-2SC6',   direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.8PF', cjValue: 0.8, ippm: '6A', ippmValue: 6, packageQty: '3K/reel', tags:['lowCap','array'] },
  { model: 'SMS05C',        direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '60PF',  cjValue: 60,  ippm: '9A', ippmValue: 9, packageQty: '3K/reel', tags:['array'] }
].map(p => ({ id: slug('SOT23-6L', p.model), package: 'SOT23-6L', category: 'ESD', ...p }))

// ==================== SOT23-5L (1 款) ====================
const sot235L = [
  { model: 'SMS05', direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '60PF', cjValue: 60, ippm: '10A', ippmValue: 10, packageQty: '3K/reel' }
].map(p => ({ id: slug('SOT23-5L', p.model), package: 'SOT23-5L', category: 'ESD', ...p }))

// ==================== SOT23 (28 款) ====================
const sot23Raw = [
  // Unidirectional
  ['SM03',     'Unidirectional', '3.3V',  3.3, 3.3,  '67PF',  67,  '11A',  11,  '3K/reel'],
  ['SM05L',    'Unidirectional', '5V',    5,   5,    '0.5PF', 0.5, '4A',   4,   '3K/reel', ['lowCap']],
  ['SM05',     'Unidirectional', '5V',    5,   5,    '60PF',  60,  '10A',  10,  '3K/reel'],
  ['SM05R',    'Unidirectional', '5V',    5,   5,    '60PF',  60,  '10A',  10,  '3K/reel'],
  ['SM12N',    'Unidirectional', '12V',   12,  12,   '80PF',  80,  '15A',  15,  '3K/reel'],
  ['SM15NB',   'Unidirectional', '15V',   15,  15,   '65PF',  65,  '11A',  11,  '3K/reel'],
  ['SM15SB',   'Unidirectional', '15V',   15,  15,   '28PF',  28,  '5A',   5,   '3K/reel'],
  ['SM18',     'Unidirectional', '18V',   18,  18,   '50PF',  50,  '10A',  10,  '3K/reel'],
  ['SM24N',    'Unidirectional', '24V',   24,  24,   '25PF',  25,  '6A',   6,   '3K/reel'],
  ['SM24NB',   'Unidirectional', '24V',   24,  24,   '45PF',  45,  '9A',   9,   '3K/reel'],
  ['SM36',     'Unidirectional', '36V',   36,  36,   '30PF',  30,  '6.5A', 6.5, '3K/reel'],
  ['SM36S',    'Unidirectional', '36V',   36,  36,   '12PF',  12,  '3.5A', 3.5, '3K/reel'],
  ['NUP1301',  'Unidirectional', '80V',   80,  80,   '0.6PF', 0.6, 'F20A', 20,  '3K/reel', ['lowCap','highSurge']],
  // Bidirectional
  ['SM03C',    'Bidirectional',  '3.3V',  3.3, 3.3,  '30PF',  30,  '20A',  20,  '3K/reel', ['highSurge']],
  ['SM03CC',   'Bidirectional',  '3.3V',  3.3, 3.3,  '65PF',  65,  '38A',  38,  '3K/reel', ['highSurge']],
  ['SM05CS',   'Bidirectional',  '5V',    5,   5,    '20PF',  20,  '11A',  11,  '3K/reel'],
  ['SM05C',    'Bidirectional',  '5V',    5,   5,    '20PF',  20,  '20A',  20,  '3K/reel', ['highSurge']],
  ['SM05CC',   'Bidirectional',  '5V',    5,   5,    '60PF',  60,  '35A',  35,  '3K/reel', ['highSurge']],
  ['SM05CH',   'Bidirectional',  '5V',    5,   5,    '8PF',   8,   '5A',   5,   '3K/reel'],
  ['SM12C',    'Bidirectional',  '12V',   12,  12,   '10PF',  10,  '11A',  11,  '3K/reel'],
  ['SM12CC',   'Bidirectional',  '12V',   12,  12,   '18PF',  18,  '20A',  20,  '3K/reel', ['highSurge']],
  ['SM15C',    'Bidirectional',  '15V',   15,  15,   '15PF',  15,  '5A',   5,   '3K/reel'],
  ['SM15CC',   'Bidirectional',  '15V',   15,  15,   '35PF',  35,  '10A',  10,  '3K/reel'],
  ['SM24C',    'Bidirectional',  '24V',   24,  24,   '7PF',   7,   '3A',   3,   '3K/reel'],
  ['SM24CB',   'Bidirectional',  '24V',   24,  24,   '10PF',  10,  '4A',   4,   '3K/reel'],
  ['SM24CC',   'Bidirectional',  '24V',   24,  24,   '30PF',  30,  '9A',   9,   '3K/reel'],
  ['SM36CS',   'Bidirectional',  '36V',   36,  36,   '6PF',   6,   '4A',   4,   '3K/reel'],
  ['SM36C',    'Bidirectional',  '36V',   36,  36,   '15PF',  15,  '6A',   6,   '3K/reel'],
  // Array
  ['SM712S',   'Bidirectional',  '7V+12V',7,   12,   '15PF',  15,  '10A+10A', 10, '3K/reel', ['array']],
  ['SM712',    'Bidirectional',  '7V+12V',7,   12,   '27PF',  27,  '18A+18A', 18, '3K/reel', ['array','highSurge']]
]
const sot23 = sot23Raw.map(([model, direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags = []]) => ({
  id: slug('SOT23', model), model, package: 'SOT23', category: 'ESD', direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags
}))

// ==================== SOT523 (1 款) ====================
const sot523 = [
  { model: 'ESD0502B', direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.5PF', cjValue: 0.5, ippm: '4A', ippmValue: 4, packageQty: '3K/reel', tags:['lowCap'] }
].map(p => ({ id: slug('SOT523', p.model), package: 'SOT523', category: 'ESD', ...p }))

// ==================== SOT323 (3 款) ====================
const sot323Pkg = [
  { model: 'SM05SZ',  direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '80PF',  cjValue: 80,  ippm: '11A', ippmValue: 11, packageQty: '3K/reel' },
  { model: 'SM05LZ',  direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.5PF', cjValue: 0.5, ippm: '4A',  ippmValue: 4,  packageQty: '3K/reel', tags:['lowCap'] },
  { model: 'SM24CBZ', direction: 'Bidirectional',  vrwm: '24V',vrwmMin: 24,vrwmMax: 24, cj: '10PF',  cjValue: 10,  ippm: '4A',  ippmValue: 4,  packageQty: '3K/reel' }
].map(p => ({ id: slug('SOT323', p.model), package: 'SOT323', category: 'ESD', ...p }))

// ==================== DFN0603-2L (17 款) ====================
const dfn0603 = [
  { model: 'ESD11D3.3C', direction: 'Bidirectional', vrwm: '3.3V',  vrwmMin: 3.3, vrwmMax: 3.3,  cj: '15PF',  cjValue: 15,  ippm: '9A',  ippmValue: 9,  packageQty: '10K/reel, custom 15K/reel' },
  { model: 'ESD11E3.3C', direction: 'Bidirectional', vrwm: '3.3V',  vrwmMin: 3.3, vrwmMax: 3.3,  cj: '20PF',  cjValue: 20,  ippm: '11A', ippmValue: 11, packageQty: '10K/reel, custom 15K/reel' },
  { model: 'ESD11S3.3C', direction: 'Bidirectional', vrwm: '3.3V',  vrwmMin: 3.3, vrwmMax: 3.3,  cj: '10PF',  cjValue: 10,  ippm: '7A',  ippmValue: 7,  packageQty: '10K/reel, custom 15K/reel' },
  { model: 'ESD11N3.3C', direction: 'Bidirectional', vrwm: '3.3V',  vrwmMin: 3.3, vrwmMax: 3.3,  cj: '30PF',  cjValue: 30,  ippm: '20A', ippmValue: 20, packageQty: '10K/reel, custom 15K/reel', tags:['highSurge'] },
  { model: 'ESD11LB3.3C',direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '0.5PF', cjValue: 0.5, ippm: '5A',  ippmValue: 5,  packageQty: '10K/reel, custom 10K/reel', tags:['lowCap'] },
  { model: 'ESD11LL5.0C',direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '0.35PF',cjValue: 0.35,ippm: '4.5A',ippmValue: 4.5,packageQty: '15K/reel, custom 10K/reel', tags:['lowCap'] },
  { model: 'ESD11LS5.0C',direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '0.3PF', cjValue: 0.3, ippm: '4A',  ippmValue: 4,  packageQty: '15K/reel, custom 10K/reel', tags:['lowCap'] },
  { model: 'ESD11LB5.0C',direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '0.5PF', cjValue: 0.5, ippm: '5A',  ippmValue: 5,  packageQty: '10K/reel, custom 15K/reel', tags:['lowCap'] },
  { model: 'ESD11LM5.0C',direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '3PF',   cjValue: 3,   ippm: '2.5A',ippmValue: 2.5,packageQty: '15K/reel, custom 10K/reel', tags:['lowCap'] },
  { model: 'ESD11S5.0C', direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '10PF',  cjValue: 10,  ippm: '6A',  ippmValue: 6,  packageQty: '15K/reel, custom 10K/reel' },
  { model: 'ESD11D5.0C', direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '15PF',  cjValue: 15,  ippm: '9A',  ippmValue: 9,  packageQty: '15K/reel, custom 10K/reel' },
  { model: 'ESD11N5.0C', direction: 'Bidirectional', vrwm: '5V',    vrwmMin: 5,   vrwmMax: 5,    cj: '35PF',  cjValue: 35,  ippm: '18A', ippmValue: 18, packageQty: '10K/reel, custom 15K/reel', tags:['highSurge'] },
  { model: 'ESD11E7.0C', direction: 'Bidirectional', vrwm: '7V',    vrwmMin: 7,   vrwmMax: 7,    cj: '18PF',  cjValue: 18,  ippm: '8A',  ippmValue: 8,  packageQty: '10K/reel, custom 15K/reel' },
  { model: 'ESD11D12C',  direction: 'Bidirectional', vrwm: '12V',   vrwmMin: 12,  vrwmMax: 12,   cj: '8PF',   cjValue: 8,   ippm: '8A',  ippmValue: 8,  packageQty: '10K/reel, custom 15K/reel' },
  { model: 'ESD11LB18C', direction: 'Bidirectional', vrwm: '18V',   vrwmMin: 18,  vrwmMax: 18,   cj: '0.5PF', cjValue: 0.5, ippm: '5A',  ippmValue: 5,  packageQty: '10K/reel, custom 15K/reel', tags:['lowCap'] },
  { model: 'ESD11LB24C', direction: 'Bidirectional', vrwm: '24V',   vrwmMin: 24,  vrwmMax: 24,   cj: '0.5PF', cjValue: 0.5, ippm: '5A',  ippmValue: 5,  packageQty: '10K/reel, custom 15K/reel', tags:['lowCap'] },
  { model: 'ESD11D24C',  direction: 'Bidirectional', vrwm: '24V',   vrwmMin: 24,  vrwmMax: 24,   cj: '4PF',   cjValue: 4,   ippm: '2A',  ippmValue: 2,  packageQty: '10K/reel, custom 15K/reel' }
].map(p => ({ id: slug('DFN0603-2L', p.model), package: 'DFN0603-2L', category: 'ESD', ...p }))

// ==================== DFN1006-2L (40 款) ====================
const dfn1006Raw = [
  // Unidirectional
  ['ESD8L3.3',  'Unidirectional', '3.3V',  3.3, 3.3,  '0.4PF',  0.4,  '4A',    4,    '10K/reel', ['lowCap']],
  ['ESD8LC3.3', 'Unidirectional', '3.3V',  3.3, 3.3,  '0.6PF',  0.6,  '11A',   11,   '10K/reel', ['lowCap']],
  ['ESD8ST3.3', 'Unidirectional', '3.3V',  3.3, 3.3,  '120PF',  120,  '65A',   65,   '10K/reel', ['highSurge']],
  ['ESD8ET4.5', 'Unidirectional', '4.5V',  4.5, 4.5,  '250PF',  250,  '80A',   80,   '10K/reel', ['highSurge']],
  ['ESD8FT5.0', 'Unidirectional', '5V',    5,   5,    '100PF',  100,  '50A',   50,   '10K/reel', ['highSurge']],
  ['ESD8RT6V3', 'Unidirectional', '5V',    5,   5,    '100PF',  100,  '32A',   32,   '10K/reel', ['highSurge']],
  ['ESD8L5.0',  'Unidirectional', '5V',    5,   5,    '0.5PF',  0.5,  '4.5A',  4.5,  '10K/reel', ['lowCap']],
  ['ESD8Z5.0',  'Unidirectional', '5V',    5,   5,    '55PF',   55,   '8A',    8,    '10K/reel'],
  ['ESD8WT7.0', 'Unidirectional', '7V',    7,   7,    '150PF',  150,  '20A',   20,   '10K/reel', ['highSurge']],
  ['ESD8D24',   'Unidirectional', '24V',   24,  24,   '20PF',   20,   '4A',    4,    '10K/reel'],
  ['ESD8D36',   'Unidirectional', '36V',   36,  36,   '12PF',   12,   '4A',    4,    '10K/reel'],
  // Bidirectional
  ['ESD8LC03CS','Bidirectional',  '3.3V',  3.3, 3.3,  '0.6PF',  0.6,  '11A',   11,   '10K/reel', ['lowCap']],
  ['ESD8LC03C', 'Bidirectional',  '3.3V',  3.3, 3.3,  '0.6PF',  0.6,  '20A',   20,   '10K/reel', ['lowCap','highSurge']],
  ['ESD8LC05C', 'Bidirectional',  '5V',    5,   5,    '0.6PF',  0.6,  '18A',   18,   '10K/reel', ['lowCap']],
  ['ESD8SB3.3C','Bidirectional',  '3.3V',  3.3, 3.3,  '0.5PF',  0.5,  '7A',    7,    '10K/reel', ['lowCap']],
  ['ESD8LB3.3C','Bidirectional',  '3.3V',  3.3, 3.3,  '0.5PF',  0.5,  '5A',    5,    '10K/reel', ['lowCap']],
  ['ESD8LB5.0C','Bidirectional',  '5V',    5,   5,    '0.5PF',  0.5,  '5A',    5,    '10K/reel', ['lowCap']],
  ['ESD8LB5.0CB','Bidirectional', '5V',    5,   5,    '0.28PF', 0.28, '9A',    9,    '10K/reel', ['lowCap']],
  ['ESD8LB18C', 'Bidirectional',  '18V',   18,  18,   '0.5PF',  0.5,  '5A',    5,    '10K/reel', ['lowCap']],
  ['ESD8LB24C', 'Bidirectional',  '24V',   24,  24,   '0.5PF',  0.5,  '5A',    5,    '10K/reel', ['lowCap']],
  ['ESD8LL3.3C','Bidirectional',  '5V',    5,   5,    '0.3PF',  0.3,  '4A',    4,    '10K/reel', ['lowCap']],
  ['ESD8S3.3C', 'Bidirectional',  '3.3V',  3.3, 3.3,  '10PF',   10,   '7A',    7,    '10K/reel'],
  ['ESD8D3.3C', 'Bidirectional',  '3.3V',  3.3, 3.3,  '15PF',   15,   '9A',    9,    '10K/reel'],
  ['ESD8D3.3CB','Bidirectional',  '3.3V',  3.3, 3.3,  '20PF',   20,   '11A',   11,   '12K/reel'],
  ['ESD8N3.3C', 'Bidirectional',  '3.3V',  3.3, 3.3,  '30PF',   30,   '20A',   20,   '10K/reel', ['highSurge']],
  ['ESD8G4.5C', 'Bidirectional',  '4.5V',  4.5, 4.5,  '100PF',  100,  '50A',   50,   '10K/reel', ['highSurge']],
  ['ESD8LL5.0C','Bidirectional',  '5V',    5,   5,    '0.35PF', 0.35, '4.5A',  4.5,  '10K/reel', ['lowCap']],
  ['ESD8L5.0C', 'Bidirectional',  '5V',    5,   5,    '0.6PF',  0.6,  '3A',    3,    '10K/reel', ['lowCap']],
  ['ESD8LT5.0C','Bidirectional',  '5V',    5,   5,    '0.3PF',  0.3,  '4.5A',  4.5,  '10K/reel', ['lowCap']],
  ['ESD8LV5.0C','Bidirectional',  '5V',    5,   5,    '0.18PF', 0.18, '3A',    3,    '10K/reel', ['lowCap']],
  ['ESD8LM5.0C','Bidirectional',  '5V',    5,   5,    '2.5PF',  2.5,  '2.5A',  2.5,  '10K/reel', ['lowCap']],
  ['ESD8LM5.0CS','Bidirectional', '5V',    5,   5,    '2.8PF',  2.8,  '3.5A',  3.5,  '10K/reel', ['lowCap']],
  ['ESD8S5.0C', 'Bidirectional',  '5V',    5,   5,    '10PF',   10,   '6A',    6,    '10K/reel'],
  ['ESD8D5.0C', 'Bidirectional',  '5V',    5,   5,    '15PF',   15,   '9A',    9,    '10K/reel'],
  ['ESD8N5.0C', 'Bidirectional',  '5V',    5,   5,    '35PF',   35,   '20A',   20,   '10K/reel', ['highSurge']],
  ['ESD8B5.0C', 'Bidirectional',  '5V',    5,   5,    '60PF',   60,   '30A',   30,   '10K/reel', ['highSurge']],
  ['ESD8U5.0C', 'Bidirectional',  '5V',    5,   5,    '100PF',  100,  '50A',   50,   '10K/reel', ['highSurge']],
  ['ESD8G5.0C', 'Bidirectional',  '5V',    5,   5,    '100PF',  100,  '50A',   50,   '10K/reel', ['highSurge']],
  ['ESD8V5.0C', 'Bidirectional',  '5V',    5,   5,    '200PF',  200,  '100A',  100,  '10K/reel', ['highSurge']],
  ['ESD8S7.0C', 'Bidirectional',  '7V',    7,   7,    '8PF',    8,    '5A',    5,    '10K/reel'],
  ['ESD8E7.0C', 'Bidirectional',  '7V',    7,   7,    '17PF',   17,   '8A',    8,    '10K/reel'],
  ['ESD8D7.0C', 'Bidirectional',  '7V',    7,   7,    '8PF',    8,    '9A',    9,    '10K/reel'],
  ['ESD8B7.0C', 'Bidirectional',  '7V',    7,   7,    '16PF',   16,   '20A',   20,   '10K/reel', ['highSurge']],
  ['ESD8D12C',  'Bidirectional',  '12V',   12,  12,   '8PF',    8,    '8A',    8,    '10K/reel'],
  ['ESD8S12C',  'Bidirectional',  '12V',   12,  12,   '5PF',    5,    '5A',    5,    '10K/reel'],
  ['ESD8D15CS', 'Bidirectional',  '15V',   15,  15,   '15PF',   15,   '5A',    5,    '10K/reel'],
  ['ESD8D24CS', 'Bidirectional',  '24V',   24,  24,   '10PF',   10,   '4A',    4,    '10K/reel'],
  ['ESD8D36CS', 'Bidirectional',  '36V',   36,  36,   '6PF',    6,    '4A',    4,    '10K/reel'],
  ['ESD8D36CC', 'Bidirectional',  '36V',   36,  36,   '22PF',   22,   '7A',    7,    '10K/reel'],
  // Multi-line / array
  ['PESD0402N', 'Bidirectional',  '5V-36V', 5,  36,   '0.05PF', 0.05, '--',    0,    '10K/reel', ['array','lowCap']]
]
const dfn1006 = dfn1006Raw.map(([model, direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags = []]) => ({
  id: slug('DFN1006-2L', model), model, package: 'DFN1006-2L', category: 'ESD', direction, vrwm, vrwmMin, vrwmMax, cj, cjValue, ippm, ippmValue, packageQty, tags
}))

// ==================== DFN1006-3L (1 款) ====================
const dfn1006_3l = [
  { model: 'ESD0502U', direction: 'Unidirectional', vrwm: '5V', vrwmMin: 5, vrwmMax: 5, cj: '0.35PF', cjValue: 0.35, ippm: '3A', ippmValue: 3, packageQty: '10K/reel', tags:['lowCap'] }
].map(p => ({ id: slug('DFN1006-3L', p.model), package: 'DFN1006-3L', category: 'ESD', ...p }))

// ==================== DFN2510-10L (2 款) ====================
const dfn2510 = [
  { model: 'ESD0524P', direction: 'Unidirectional', vrwm: '5V',  vrwmMin: 5, vrwmMax: 5, cj: '0.5PF', cjValue: 0.5, ippm: '4A', ippmValue: 4, packageQty: '3K/reel', tags:['lowCap','array'] },
  { model: 'ESD3324P', direction: 'Unidirectional', vrwm: '3.3V',vrwmMin: 3.3,vrwmMax: 3.3,cj: '0.5PF', cjValue: 0.5, ippm: '5A', ippmValue: 5, packageQty: '3K/reel', tags:['lowCap','array'] }
].map(p => ({ id: slug('DFN2510-10L', p.model), package: 'DFN2510-10L', category: 'ESD', ...p }))

// ==================== 全部产品聚合 ====================
export const products = [
  ...sod923, ...sod523, ...sod323, ...sot363, ...sot353, ...sot236L,
  ...sot235L, ...sot23, ...sot523, ...sot323Pkg, ...dfn0603, ...dfn1006,
  ...dfn1006_3l, ...dfn2510
].map(p => ({
  ...p,
  vrwmDisplay: p.vrwm,
  summary: `${p.package} ${p.direction} ${p.vrwm} ${p.cj} ${p.ippm} - Wholesale ESD TVS diode for B2B buyers`,
  applications: p.vrwmMin <= 5
    ? appByVoltage.low
    : p.vrwmMin <= 12
      ? appByVoltage.mid
      : appByVoltage.high
}))

// 封装筛选选项（按要求固定顺序）
export const packageOptions = [
  'SOD923', 'SOD523', 'SOD323', 'SOT363', 'SOT353',
  'SOT23-6L', 'SOT23-5L', 'SOT23', 'SOT523', 'SOT323',
  'DFN0603-2L', 'DFN1006-2L', 'DFN1006-3L', 'DFN2510-10L'
]

// 极性选项
export const directionOptions = ['Unidirectional', 'Bidirectional']

// 工作电压区间档位
export const voltageBuckets = [
  { label: '≤ 5V',   min: 0,  max: 5    },
  { label: '5V - 12V', min: 5.01, max: 12 },
  { label: '12V - 24V', min: 12.01, max: 24 },
  { label: '> 24V',   min: 24.01, max: 999 }
]

// 通过 id 查产品
export function getProductById(id) {
  return products.find(p => p.id === id)
}

// 同封装其他型号（用于详情页推荐）
export function getRelatedByPackage(id, limit = 6) {
  const me = getProductById(id)
  if (!me) return []
  return products.filter(p => p.package === me.package && p.id !== id).slice(0, limit)
}

// 同电压其他封装
export function getRelatedByVoltage(id, limit = 6) {
  const me = getProductById(id)
  if (!me) return []
  return products.filter(p => p.vrwmMin === me.vrwmMin && p.id !== id).slice(0, limit)
}
