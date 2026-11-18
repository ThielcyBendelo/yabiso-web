-- ============================================================
-- MYSQL 8.0 - INITIALIZATION SCRIPT
-- Database: yabiso_transactional
-- ============================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS yabiso_transactional CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yabiso_transactional;

-- ============================================================
-- SUPPLIER / VENDOR MANAGEMENT
-- ============================================================

CREATE TABLE suppliers (
  supplier_id CHAR(36) PRIMARY KEY,
  user_auth_id CHAR(36) NOT NULL UNIQUE,  -- Reference to SQL Server users_auth.user_id
  company_name VARCHAR(255) NOT NULL UNIQUE,
  manager_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  rccm_number VARCHAR(50) UNIQUE,
  kra_number VARCHAR(50),
  tax_id VARCHAR(50),
  registration_number VARCHAR(100),
  bank_account_iban VARCHAR(100),
  kyc_status ENUM('pending', 'verified', 'rejected', 'expired') DEFAULT 'pending',
  verification_notes TEXT,
  verified_by VARCHAR(36),
  verified_at DATETIME,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_products INT DEFAULT 0,
  total_sales_usd DECIMAL(15,2) DEFAULT 0.00,
  response_time_hours INT DEFAULT 24,
  return_policy TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_rccm (rccm_number),
  KEY idx_kyc_status (kyc_status),
  KEY idx_created_at (created_at),
  KEY idx_rating (rating DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCT MANAGEMENT
-- ============================================================

CREATE TABLE product_categories (
  category_id CHAR(36) PRIMARY KEY,
  parent_category_id CHAR(36),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  icon_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_category_id) REFERENCES product_categories(category_id),
  KEY idx_name (name),
  KEY idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  product_id CHAR(36) PRIMARY KEY,
  supplier_id CHAR(36) NOT NULL,
  category_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  price_usd DECIMAL(12,2) NOT NULL,
  stock_quantity INT NOT NULL,
  min_order_qty INT DEFAULT 1,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  purchase_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES product_categories(category_id),
  FULLTEXT INDEX ft_search (title, description),
  KEY idx_supplier (supplier_id),
  KEY idx_status (status),
  KEY idx_price (price_usd),
  KEY idx_created_at (created_at DESC),
  KEY idx_rating (rating DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ORDER MANAGEMENT
-- ============================================================

CREATE TABLE orders (
  order_id CHAR(36) PRIMARY KEY,
  buyer_id CHAR(36) NOT NULL,
  supplier_id CHAR(36) NOT NULL,
  total_amount_usd DECIMAL(15,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'disputed') DEFAULT 'pending',
  payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
  shipping_address_json JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expected_delivery_at DATETIME,
  
  FOREIGN KEY (buyer_id) REFERENCES suppliers(supplier_id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  KEY idx_buyer (buyer_id),
  KEY idx_supplier (supplier_id),
  KEY idx_status (status),
  KEY idx_payment_status (payment_status),
  KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  item_id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price_usd DECIMAL(12,2) NOT NULL,
  total_price_usd DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price_usd) STORED,
  
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  KEY idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PAYMENT MANAGEMENT
-- ============================================================

CREATE TABLE payment_methods (
  method_id CHAR(36) PRIMARY KEY,
  supplier_id CHAR(36) NOT NULL,
  method_type ENUM('stripe', 'paypal', 'airtel', 'vodacom', 'orange') NOT NULL,
  is_default BIT DEFAULT 0,
  bank_account_iban VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
  KEY idx_supplier (supplier_id),
  KEY idx_method_type (method_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
  payment_id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  method_type ENUM('stripe', 'paypal', 'airtel', 'vodacom', 'orange') NOT NULL,
  amount_usd DECIMAL(15,2) NOT NULL,
  amount_local_currency DECIMAL(15,2),
  exchange_rate DECIMAL(10,4),
  fees_usd DECIMAL(10,2),
  status ENUM('initiated', 'pending', 'success', 'failed', 'refunded', 'timeout') DEFAULT 'initiated',
  external_transaction_ref VARCHAR(200) UNIQUE,
  idempotency_key VARCHAR(100) UNIQUE NOT NULL,
  provider_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  processed_at DATETIME,
  
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  KEY idx_status (status),
  KEY idx_method_type (method_type),
  KEY idx_external_ref (external_transaction_ref),
  KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- NOTIFICATION MANAGEMENT
-- ============================================================

CREATE TABLE notifications (
  notification_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- payment_received, order_shipped, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data_json JSON,
  read_at DATETIME,
  archived_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_user_read (user_id, read_at),
  KEY idx_created_at (created_at DESC),
  KEY idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA (FOR TESTING - DELETE IN PRODUCTION)
-- ============================================================

-- Insert test categories
INSERT INTO product_categories (category_id, name, slug, description)
VALUES 
  (UUID(), 'Agriculture', 'agriculture', 'Produits agricoles et cultures'),
  (UUID(), 'Artisanat', 'artisanat', 'Produits artisanaux faits à la main'),
  (UUID(), 'Cosmétiques', 'cosmetiques', 'Produits de beauté et cosmétiques');

-- Insert test suppliers
INSERT INTO suppliers (supplier_id, user_auth_id, company_name, manager_name, phone_number, province, city, kyc_status)
VALUES 
  (UUID(), 'supplier-1', 'Compagnie Agricole RDC', 'Jean Dupont', '+243812345678', 'Kasai', 'Kananga', 'verified'),
  (UUID(), 'supplier-2', 'Artisans du Congo', 'Marie Mobutu', '+243817654321', 'Kinshasa', 'Kinshasa', 'verified');

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_products_price ON products(price_usd);
CREATE INDEX idx_payments_status_date ON payments(status, created_at DESC);
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX idx_suppliers_kyc ON suppliers(kyc_status, created_at DESC);

-- ============================================================
-- VIEWS (OPTIONAL - FOR REPORTING)
-- ============================================================

CREATE VIEW vw_supplier_stats AS
SELECT 
  s.supplier_id,
  s.company_name,
  COUNT(DISTINCT p.product_id) as total_products,
  COUNT(DISTINCT o.order_id) as total_orders,
  SUM(o.total_amount_usd) as total_sales_usd,
  AVG(s.rating) as avg_rating,
  s.kyc_status,
  s.created_at
FROM suppliers s
LEFT JOIN products p ON s.supplier_id = p.supplier_id
LEFT JOIN orders o ON s.supplier_id = o.supplier_id
GROUP BY s.supplier_id, s.company_name, s.kyc_status, s.created_at;

SHOW WARNINGS;
SELECT 'MySQL initialization completed successfully!' as Status;
