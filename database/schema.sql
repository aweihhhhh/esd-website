-- ============================================================================
-- ESD Diode Wholesale - MySQL 8.0 Database Schema
-- ============================================================================
-- 创建方式: mysql -u root -p123456 < schema.sql
-- 字符集: utf8mb4 / utf8mb4_unicode_ci (支持 4 种语言: EN/中文/PT-BR/RU + Emoji)
-- ============================================================================

DROP DATABASE IF EXISTS esd_website;
CREATE DATABASE esd_website
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE esd_website;

-- ----------------------------------------------------------------------------
-- 1. users - 用户表 (B2B: 区分个人/企业, 支持企业子账号)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(120) NOT NULL UNIQUE COMMENT '登录邮箱, 唯一',
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 加密',
  full_name     VARCHAR(80)  NOT NULL COMMENT '联系人姓名',
  avatar        VARCHAR(255) NULL,
  phone         VARCHAR(40)  NULL,
  whatsapp       VARCHAR(40)  NULL,
  role          ENUM('customer','vip','staff','admin') NOT NULL DEFAULT 'customer' COMMENT '角色: 普通/VIP/员工/超管',
  company_id    INT UNSIGNED NULL COMMENT '所属企业 (B2B 多账号共用企业)',
  preferred_language ENUM('en','zh','pt-BR','ru') NOT NULL DEFAULT 'en',
  preferred_currency ENUM('USD','CNY','BRL','RUB','EUR') NOT NULL DEFAULT 'USD',
  email_verified_at TIMESTAMP NULL,
  last_login_at    TIMESTAMP NULL,
  status        ENUM('active','suspended','pending') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_users_company (company_id),
  KEY idx_users_role (role)
) ENGINE=InnoDB COMMENT='用户表';

-- ----------------------------------------------------------------------------
-- 2. companies - 企业表 (B2B 主体)
-- ----------------------------------------------------------------------------
CREATE TABLE companies (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(150) NOT NULL COMMENT '企业名',
  name_en       VARCHAR(200) NULL,
  business_license VARCHAR(80) NULL COMMENT '营业执照号',
  tax_id        VARCHAR(60) NULL,
  country       VARCHAR(60) NOT NULL,
  state         VARCHAR(60) NULL,
  city          VARCHAR(60) NULL,
  address       VARCHAR(255) NULL,
  postal_code   VARCHAR(20) NULL,
  industry      VARCHAR(80) NULL COMMENT '行业',
  website       VARCHAR(200) NULL,
  contact_email VARCHAR(120) NULL,
  contact_phone VARCHAR(40) NULL,
  verified      TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否认证企业',
  credit_limit  DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '信用额度',
  vip_level     TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'VIP 等级 0-5',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_companies_name (name)
) ENGINE=InnoDB COMMENT='企业信息表';

-- ----------------------------------------------------------------------------
-- 3. addresses - 收货地址簿
-- ----------------------------------------------------------------------------
CREATE TABLE addresses (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  label         VARCHAR(50) NULL COMMENT 'Home / Office / Warehouse',
  contact_name  VARCHAR(80) NOT NULL,
  contact_phone VARCHAR(40) NOT NULL,
  country       VARCHAR(60) NOT NULL,
  state         VARCHAR(60) NULL,
  city          VARCHAR(60) NOT NULL,
  address_line1 VARCHAR(200) NOT NULL,
  address_line2 VARCHAR(200) NULL,
  postal_code   VARCHAR(20) NULL,
  is_default    TINYINT(1) NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_addresses_user (user_id)
) ENGINE=InnoDB COMMENT='收货地址';

-- ----------------------------------------------------------------------------
-- 4. categories - 产品分类 (支持多语言)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id     INT UNSIGNED NULL,
  slug          VARCHAR(80) NOT NULL UNIQUE,
  icon          VARCHAR(50) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_categories_parent (parent_id)
) ENGINE=InnoDB COMMENT='分类';

-- 5. category_translations - 分类多语言
CREATE TABLE category_translations (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id   INT UNSIGNED NOT NULL,
  language      ENUM('en','zh','pt-BR','ru') NOT NULL,
  name          VARCHAR(120) NOT NULL,
  description   VARCHAR(500) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cat_lang (category_id, language)
) ENGINE=InnoDB COMMENT='分类翻译';

-- ----------------------------------------------------------------------------
-- 6. products - 产品主表
-- ----------------------------------------------------------------------------
CREATE TABLE products (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sku             VARCHAR(80) NOT NULL UNIQUE COMMENT '内部 SKU (如 ESD-SOD323-SD05)',
  model           VARCHAR(80) NOT NULL COMMENT '流通型号 (如 SD05)',
  slug            VARCHAR(120) NOT NULL UNIQUE COMMENT 'URL slug',
  category_id     INT UNSIGNED NOT NULL,
  package_type    VARCHAR(40) NOT NULL COMMENT '封装',
  direction       ENUM('Unidirectional','Bidirectional') NOT NULL,
  vrwm            VARCHAR(40) NOT NULL COMMENT '工作电压原始字符串 (5V, 7V+12V 等)',
  vrwm_min        DECIMAL(5,2) NOT NULL COMMENT '最低电压 (V)',
  vrwm_max        DECIMAL(5,2) NOT NULL COMMENT '最高电压 (V, 等于 vrwm_min 表示单值)',
  cj_value        DECIMAL(8,3) NOT NULL COMMENT '结电容 (pF)',
  cj_display      VARCHAR(20) NOT NULL,
  ippm_value      DECIMAL(8,3) NOT NULL COMMENT '最大脉冲电流 (A)',
  ippm_display    VARCHAR(20) NOT NULL,
  package_qty     VARCHAR(60) NOT NULL COMMENT '3K/reel, 10K/reel, custom 15K/reel',
  moq             INT UNSIGNED NOT NULL DEFAULT 1000 COMMENT '最小起订量 (pcs)',
  lead_time_days  INT UNSIGNED NOT NULL DEFAULT 14 COMMENT '交期 (天)',
  stock_qty       INT NOT NULL DEFAULT 0 COMMENT '当前库存 (pcs)',
  price_usd       DECIMAL(10,4) NOT NULL DEFAULT 0 COMMENT '基准报价 USD/pcs (价格阶梯在 price_breaks 表)',
  datasheet_url   VARCHAR(255) NULL,
  rohs_compliant  TINYINT(1) NOT NULL DEFAULT 1,
  reach_compliant TINYINT(1) NOT NULL DEFAULT 1,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  is_featured     TINYINT(1) NOT NULL DEFAULT 0,
  view_count      INT UNSIGNED NOT NULL DEFAULT 0,
  inquiry_count   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_model (model),
  KEY idx_products_package (package_type),
  KEY idx_products_category (category_id),
  KEY idx_products_vrwm (vrwm_min, vrwm_max),
  KEY idx_products_cj (cj_value),
  KEY idx_products_ippm (ippm_value),
  FULLTEXT KEY ft_products_search (model, sku)
) ENGINE=InnoDB COMMENT='产品主表';

-- 7. product_translations - 产品多语言 (名称/描述/应用)
CREATE TABLE product_translations (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id      INT UNSIGNED NOT NULL,
  language        ENUM('en','zh','pt-BR','ru') NOT NULL,
  name            VARCHAR(150) NOT NULL,
  short_desc      VARCHAR(500) NULL,
  long_desc       TEXT NULL,
  applications    TEXT NULL COMMENT 'JSON 数组或换行分隔',
  keywords        VARCHAR(255) NULL,
  meta_title      VARCHAR(150) NULL,
  meta_desc       VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_prod_lang (product_id, language),
  FULLTEXT KEY ft_pt_search (name, short_desc, applications)
) ENGINE=InnoDB COMMENT='产品多语言翻译';

-- 8. product_images - 产品图 (实拍/SVG/数据手册插图)
CREATE TABLE product_images (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  image_type    ENUM('topView','pinout','appCircuit','packageTape','specCurve','real','datasheet') NOT NULL,
  url           VARCHAR(500) NOT NULL,
  alt_text      VARCHAR(200) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_primary    TINYINT(1) NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_images_product (product_id)
) ENGINE=InnoDB COMMENT='产品图';

-- 9. product_price_breaks - 价格阶梯 (B2B 核心: 量越大越便宜)
CREATE TABLE product_price_breaks (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  min_qty       INT UNSIGNED NOT NULL COMMENT '起订数量',
  max_qty       INT UNSIGNED NULL COMMENT '上限数量 (NULL = 无上限)',
  price_usd     DECIMAL(10,4) NOT NULL COMMENT '此区间单价 USD',
  PRIMARY KEY (id),
  KEY idx_ppb_product (product_id, min_qty)
) ENGINE=InnoDB COMMENT='价格阶梯表';

-- 10. product_related - 替代型号 / 关联型号
CREATE TABLE product_related (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  related_id    INT UNSIGNED NOT NULL,
  relation_type ENUM('equivalent','alternative','upgrade','package_alt','voltage_alt') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pr (product_id, related_id, relation_type)
) ENGINE=InnoDB COMMENT='产品关联';

-- ----------------------------------------------------------------------------
-- 11. inquiries - 询价单 (RFQ)
-- ----------------------------------------------------------------------------
CREATE TABLE inquiries (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  inquiry_no      VARCHAR(40) NOT NULL UNIQUE COMMENT '询价单号 INQ-2026-00001',
  user_id         INT UNSIGNED NULL COMMENT '已注册用户',
  company_name    VARCHAR(150) NOT NULL,
  contact_name    VARCHAR(80)  NOT NULL,
  contact_email   VARCHAR(120) NOT NULL,
  contact_phone   VARCHAR(40)  NULL,
  whatsapp         VARCHAR(40)  NULL,
  country         VARCHAR(60)  NULL,
  industry        VARCHAR(80)  NULL,
  application     VARCHAR(255) NULL,
  total_qty       INT UNSIGNED NOT NULL DEFAULT 0,
  target_price    DECIMAL(10,4) NULL,
  currency        ENUM('USD','CNY','BRL','RUB','EUR') NOT NULL DEFAULT 'USD',
  incoterm        ENUM('EXW','FOB','CIF','DDP','DAP') NOT NULL DEFAULT 'FOB',
  status          ENUM('new','processing','quoted','won','lost','closed') NOT NULL DEFAULT 'new',
  assigned_to     INT UNSIGNED NULL COMMENT '分配给的销售',
  quote_amount    DECIMAL(12,2) NULL,
  quote_currency  ENUM('USD','CNY','BRL','RUB','EUR') NULL,
  quote_valid_until DATE NULL,
  notes           TEXT NULL,
  internal_notes  TEXT NULL COMMENT '内部备注, 客户不可见',
  source          ENUM('web','email','whatsapp','api','import') NOT NULL DEFAULT 'web',
  preferred_language ENUM('en','zh','pt-BR','ru') NOT NULL DEFAULT 'en',
  ip_address      VARCHAR(45) NULL,
  user_agent      VARCHAR(500) NULL,
  bom_file_url    VARCHAR(500) NULL COMMENT 'BOM 文件',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inquiries_user (user_id),
  KEY idx_inquiries_status (status),
  KEY idx_inquiries_date (created_at)
) ENGINE=InnoDB COMMENT='询价单主表';

-- 12. inquiry_items - 询价明细
CREATE TABLE inquiry_items (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  inquiry_id    INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NULL,
  model         VARCHAR(80) NOT NULL COMMENT '客户填的型号 (可不在系统里)',
  brand         VARCHAR(60) NULL,
  package_type  VARCHAR(40) NULL,
  qty           INT UNSIGNED NOT NULL,
  target_price  DECIMAL(10,4) NULL,
  remark        VARCHAR(255) NULL,
  PRIMARY KEY (id),
  KEY idx_ii_inquiry (inquiry_id)
) ENGINE=InnoDB COMMENT='询价明细';

-- 13. inquiry_messages - 询价沟通记录
CREATE TABLE inquiry_messages (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  inquiry_id    INT UNSIGNED NOT NULL,
  sender_type   ENUM('customer','staff','system') NOT NULL,
  sender_id     INT UNSIGNED NULL,
  content       TEXT NOT NULL,
  attachment_url VARCHAR(500) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_im_inquiry (inquiry_id)
) ENGINE=InnoDB COMMENT='询价沟通';

-- ----------------------------------------------------------------------------
-- 14. orders - 订单 (从确认的报价生成)
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_no        VARCHAR(40) NOT NULL UNIQUE,
  user_id         INT UNSIGNED NOT NULL,
  inquiry_id      INT UNSIGNED NULL COMMENT '从哪个询价单转化',
  status          ENUM('pending','confirmed','paid','producing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  subtotal        DECIMAL(12,2) NOT NULL,
  shipping_fee    DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax             DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount        DECIMAL(10,2) NOT NULL DEFAULT 0,
  total           DECIMAL(12,2) NOT NULL,
  currency        ENUM('USD','CNY','BRL','RUB','EUR') NOT NULL DEFAULT 'USD',
  payment_method  ENUM('T/T','PayPal','L/C','Western Union','Credit Card') NULL,
  payment_status  ENUM('unpaid','partial','paid','refunded') NOT NULL DEFAULT 'unpaid',
  incoterm        ENUM('EXW','FOB','CIF','DDP','DAP') NOT NULL DEFAULT 'FOB',
  shipping_address_id INT UNSIGNED NULL,
  tracking_no     VARCHAR(100) NULL,
  shipping_carrier VARCHAR(60) NULL,
  notes           TEXT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status)
) ENGINE=InnoDB COMMENT='订单表';

-- 15. order_items
CREATE TABLE order_items (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NOT NULL,
  model         VARCHAR(80) NOT NULL,
  qty           INT UNSIGNED NOT NULL,
  unit_price    DECIMAL(10,4) NOT NULL,
  line_total    DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_oi_order (order_id)
) ENGINE=InnoDB COMMENT='订单明细';

-- ----------------------------------------------------------------------------
-- 16. favorites - 收藏
-- ----------------------------------------------------------------------------
CREATE TABLE favorites (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_fav (user_id, product_id)
) ENGINE=InnoDB COMMENT='收藏夹';

-- 17. compare_list - 对比清单
CREATE TABLE compare_list (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cmp (user_id, product_id)
) ENGINE=InnoDB COMMENT='产品对比';

-- 18. reviews - 评价
CREATE TABLE reviews (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED NOT NULL,
  rating        TINYINT UNSIGNED NOT NULL COMMENT '1-5',
  title         VARCHAR(120) NULL,
  content       TEXT NULL,
  pros          VARCHAR(500) NULL,
  cons          VARCHAR(500) NULL,
  is_verified   TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否真实购买',
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_product (product_id)
) ENGINE=InnoDB COMMENT='产品评价';

-- 19. newsletter - 邮件订阅
CREATE TABLE newsletter (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(120) NOT NULL UNIQUE,
  language      ENUM('en','zh','pt-BR','ru') NOT NULL DEFAULT 'en',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  unsubscribed_at TIMESTAMP NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB COMMENT='邮件订阅';

-- 20. audit_logs - 审计日志 (合规)
CREATE TABLE audit_logs (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NULL,
  action        VARCHAR(60) NOT NULL COMMENT 'login / update_product / submit_inquiry 等',
  entity_type   VARCHAR(40) NULL,
  entity_id     INT UNSIGNED NULL,
  changes       JSON NULL COMMENT '变更前/后',
  ip_address    VARCHAR(45) NULL,
  user_agent    VARCHAR(500) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_user (user_id),
  KEY idx_audit_action (action),
  KEY idx_audit_date (created_at)
) ENGINE=InnoDB COMMENT='审计日志';

-- 21. settings - 系统配置 (KV)
CREATE TABLE settings (
  k             VARCHAR(60) NOT NULL PRIMARY KEY,
  v             TEXT NULL,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='系统配置';

-- ============================================================================
-- 完成
-- ============================================================================
SHOW TABLES;
