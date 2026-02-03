-- Deals247 Database Schema
-- Generated from Prisma Schema

-- ============================================
-- ENUMS (implemented as CHECK constraints in MySQL)
-- ============================================

-- StoreStatus: ACTIVE, INACTIVE
-- DealStatus: DRAFT, PUBLISHED, EXPIRED, ARCHIVED  
-- AdminRole: ADMIN, EDITOR
-- AdminStatus: ACTIVE, INACTIVE
-- PageStatus: DRAFT, PUBLISHED

-- ============================================
-- TABLES
-- ============================================

-- Stores Table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    website_url VARCHAR(500) NOT NULL,
    affiliate_program_name VARCHAR(255),
    affiliate_base_url VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

-- Categories Table (supports hierarchical categories)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id INT,
    sort_order INT DEFAULT 0,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tags Table
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

-- Admins Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'EDITOR') DEFAULT 'EDITOR',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    last_login_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

-- Deals Table (main entity)
CREATE TABLE deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    store_id INT NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT,
    product_image_url VARCHAR(500),
    product_url VARCHAR(500),
    affiliate_url VARCHAR(500) NOT NULL,
    coupon_code VARCHAR(100),
    original_price DECIMAL(10, 2) NOT NULL,
    deal_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    discount_percent DECIMAL(5, 2) NOT NULL,
    starts_at DATETIME(3),
    expires_at DATETIME(3),
    status ENUM('DRAFT', 'PUBLISHED', 'EXPIRED', 'ARCHIVED') DEFAULT 'DRAFT',
    is_featured BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES admins(id),
    INDEX idx_store_id (store_id),
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB;

-- Deal Categories Junction Table (many-to-many)
CREATE TABLE deal_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_deal_category (deal_id, category_id),
    INDEX idx_deal_id (deal_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB;

-- Deal Tags Junction Table (many-to-many)
CREATE TABLE deal_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_deal_tag (deal_id, tag_id),
    INDEX idx_deal_id (deal_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB;

-- Deal Clicks Table (analytics/tracking)
CREATE TABLE deal_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_id INT NOT NULL,
    clicked_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    referrer VARCHAR(500),
    sub_id VARCHAR(100),
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    INDEX idx_deal_id (deal_id),
    INDEX idx_clicked_at (clicked_at)
) ENGINE=InnoDB;

-- Pages Table (static content)
CREATE TABLE pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    content_html TEXT NOT NULL,
    status ENUM('DRAFT', 'PUBLISHED') DEFAULT 'DRAFT',
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

-- Deal Price History Table (optional, for tracking price changes)
CREATE TABLE deal_price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_id INT NOT NULL,
    recorded_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    price DECIMAL(10, 2) NOT NULL,
    source VARCHAR(50) DEFAULT 'manual',
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    INDEX idx_deal_id (deal_id),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB;

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Get all published deals with store info
-- SELECT d.*, s.name as store_name FROM deals d 
-- JOIN stores s ON d.store_id = s.id 
-- WHERE d.status = 'PUBLISHED' ORDER BY d.created_at DESC;

-- Get deals by category
-- SELECT d.* FROM deals d
-- JOIN deal_categories dc ON d.id = dc.deal_id
-- JOIN categories c ON dc.category_id = c.id
-- WHERE c.slug = 'electronics';

-- Track clicks per deal
-- SELECT d.title, COUNT(dc.id) as click_count FROM deals d
-- LEFT JOIN deal_clicks dc ON d.id = dc.deal_id
-- GROUP BY d.id ORDER BY click_count DESC;
