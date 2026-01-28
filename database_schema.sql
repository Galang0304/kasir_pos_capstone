-- ============================================
-- WEB KASIR - DATABASE SCHEMA untuk MySQL
-- ============================================
-- Instruksi:
-- 1. Buka XAMPP, start Apache dan MySQL
-- 2. Buka phpMyAdmin (http://localhost/phpmyadmin)
-- 3. Buat database baru dengan nama: web_kasir
-- 4. Import file ini atau jalankan query di bawah
-- ============================================

CREATE DATABASE IF NOT EXISTS web_kasir;
USE web_kasir;

-- ============================================
-- TABLE: users (untuk login)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'cashier') DEFAULT 'cashier',
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default users
INSERT INTO users (id, username, password, name, role, email) VALUES
('1', 'admin', '$2a$10$8OVnwOkLOEq.wjHxJFcPPuDnUmzG0QVa4g5P0Y6RQMjMGYZLKHhru', 'Administrator', 'admin', 'admin@kasir.com'),
('2', 'kasir1', '$2a$10$8OVnwOkLOEq.wjHxJFcPPuDnUmzG0QVa4g5P0Y6RQMjMGYZLKHhru', 'Kasir 1', 'cashier', 'kasir1@kasir.com');

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES
('Makanan'),
('Minuman'),
('Snack'),
('Lainnya');

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) DEFAULT 'Lainnya',
  price DECIMAL(15, 2) NOT NULL,
  stock INT DEFAULT 0,
  sku VARCHAR(50) UNIQUE NOT NULL,
  image VARCHAR(500) DEFAULT 'https://via.placeholder.com/150',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE
);

-- Insert sample products
INSERT INTO products (id, name, category, price, stock, sku, image, description) VALUES
('1', 'Nasi Goreng', 'Makanan', 15000, 100, 'FD001', 'https://via.placeholder.com/150', 'Nasi goreng spesial'),
('2', 'Mie Goreng', 'Makanan', 13000, 80, 'FD002', 'https://via.placeholder.com/150', 'Mie goreng enak'),
('3', 'Es Teh Manis', 'Minuman', 5000, 200, 'DR001', 'https://via.placeholder.com/150', 'Es teh manis segar'),
('4', 'Kopi Hitam', 'Minuman', 8000, 150, 'DR002', 'https://via.placeholder.com/150', 'Kopi hitam original');

-- ============================================
-- TABLE: customers
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) DEFAULT '-',
  email VARCHAR(100) DEFAULT '-',
  address TEXT,
  points INT DEFAULT 0,
  total_spent DECIMAL(15, 2) DEFAULT 0,
  visit_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default customer
INSERT INTO customers (id, name, phone, email, address, points, total_spent, visit_count) VALUES
('1', 'Customer Umum', '-', '-', '-', 0, 0, 0);

-- ============================================
-- TABLE: employees
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  salary DECIMAL(15, 2) DEFAULT 0,
  join_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample employees
INSERT INTO employees (id, name, position, phone, email, salary, join_date, status) VALUES
('1', 'Admin User', 'Administrator', '08123456789', 'admin@kasir.com', 5000000, '2024-01-01', 'active'),
('2', 'Kasir 1', 'Cashier', '08234567890', 'kasir1@kasir.com', 3500000, '2024-02-01', 'active');

-- ============================================
-- TABLE: transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id VARCHAR(36),
  customer_name VARCHAR(100),
  cashier_id VARCHAR(36),
  cashier_name VARCHAR(100),
  subtotal DECIMAL(15, 2) NOT NULL,
  discount DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2) NOT NULL,
  change_amount DECIMAL(15, 2) DEFAULT 0,
  payment_method ENUM('cash', 'debit', 'credit', 'ewallet') DEFAULT 'cash',
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: transaction_items
-- ============================================
CREATE TABLE IF NOT EXISTS transaction_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36),
  product_name VARCHAR(200),
  product_sku VARCHAR(50),
  price DECIMAL(15, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================
-- INDEXES untuk performa
-- ============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);

-- ============================================
-- VIEWS untuk reporting
-- ============================================

-- View untuk dashboard stats
CREATE OR REPLACE VIEW v_today_sales AS
SELECT 
  COUNT(*) as transaction_count,
  COALESCE(SUM(total), 0) as total_sales
FROM transactions
WHERE DATE(created_at) = CURDATE()
AND status = 'completed';

-- View untuk best selling products
CREATE OR REPLACE VIEW v_best_selling_products AS
SELECT 
  p.id,
  p.name,
  p.sku,
  p.price,
  p.category,
  COALESCE(SUM(ti.quantity), 0) as total_sold,
  COALESCE(SUM(ti.subtotal), 0) as total_revenue
FROM products p
LEFT JOIN transaction_items ti ON p.id = ti.product_id
GROUP BY p.id, p.name, p.sku, p.price, p.category
ORDER BY total_sold DESC;

-- View untuk low stock products
CREATE OR REPLACE VIEW v_low_stock_products AS
SELECT * FROM products
WHERE stock < 10
ORDER BY stock ASC;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure untuk update customer stats
DELIMITER $$
CREATE PROCEDURE update_customer_stats(
  IN p_customer_id VARCHAR(36),
  IN p_total DECIMAL(15, 2)
)
BEGIN
  UPDATE customers
  SET 
    total_spent = total_spent + p_total,
    visit_count = visit_count + 1,
    points = points + FLOOR(p_total / 1000)
  WHERE id = p_customer_id;
END$$
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger untuk auto update stock setelah transaksi
DELIMITER $$
CREATE TRIGGER after_transaction_item_insert
AFTER INSERT ON transaction_items
FOR EACH ROW
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
END$$
DELIMITER ;

-- ============================================
-- DONE!
-- ============================================
-- Database schema berhasil dibuat!
-- Default login:
--   Username: admin, Password: admin123
--   Username: kasir1, Password: admin123
-- ============================================
