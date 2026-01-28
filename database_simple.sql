-- Create Database
CREATE DATABASE IF NOT EXISTS web_kasir;
USE web_kasir;

-- Table: users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'cashier') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  category_id INT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  min_stock INT DEFAULT 5,
  unit VARCHAR(20) DEFAULT 'pcs',
  image_url VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_sku (sku),
  INDEX idx_active (is_active)
);

-- Table: customers
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  loyalty_points INT DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  visit_count INT DEFAULT 0,
  last_visit DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_email (email)
);

-- Table: employees
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  salary DECIMAL(10, 2),
  join_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: transactions
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT,
  cashier_id INT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method ENUM('cash', 'card', 'qris', 'transfer') NOT NULL,
  payment_amount DECIMAL(12, 2) NOT NULL,
  change_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  points_earned INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_invoice (invoice_number),
  INDEX idx_customer (customer_id),
  INDEX idx_cashier (cashier_id),
  INDEX idx_date (created_at)
);

-- Table: transaction_items
CREATE TABLE transaction_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_transaction (transaction_id),
  INDEX idx_product (product_id)
);

-- Insert sample data: users
-- Password untuk semua user: admin123
INSERT INTO users (username, password, full_name, role) VALUES
('admin', '$2a$10$a97JFzq2Sf0BDJ.hErFLy.T/K.9KKl6OdRX4uHvJGG/h3dCRFZyq6', 'Administrator', 'admin'),
('kasir1', '$2a$10$a97JFzq2Sf0BDJ.hErFLy.T/K.9KKl6OdRX4uHvJGG/h3dCRFZyq6', 'Kasir 1', 'cashier');

-- Insert sample data: categories
INSERT INTO categories (name, description) VALUES
('Makanan', 'Produk makanan dan snack'),
('Minuman', 'Minuman dingin dan panas'),
('Elektronik', 'Barang elektronik'),
('Alat Tulis', 'Perlengkapan kantor dan sekolah');

-- Insert sample data: products
INSERT INTO products (name, sku, category_id, price, stock, min_stock, unit, description) VALUES
('Nasi Goreng', 'FOOD-001', 1, 15000, 100, 10, 'porsi', 'Nasi goreng spesial'),
('Es Teh Manis', 'DRINK-001', 2, 5000, 200, 20, 'gelas', 'Teh manis dingin'),
('Pulpen Hitam', 'STAT-001', 4, 3000, 150, 30, 'pcs', 'Pulpen tinta hitam'),
('Kopi Susu', 'DRINK-002', 2, 12000, 80, 15, 'gelas', 'Kopi susu premium');

-- Insert sample data: customers
INSERT INTO customers (name, phone, email, loyalty_points, total_spent, visit_count) VALUES
('Pelanggan Umum', '-', '-', 0, 0, 0);

-- Insert sample data: employees
INSERT INTO employees (name, position, phone, salary, join_date, status) VALUES
('Budi Santoso', 'Kasir', '081234567890', 3500000, '2024-01-01', 'active'),
('Siti Nurhaliza', 'Manager', '081234567891', 5000000, '2024-01-01', 'active');
