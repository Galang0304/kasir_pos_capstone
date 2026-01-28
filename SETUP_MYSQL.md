# 📦 Setup MySQL Database dengan XAMPP

## 🚀 Langkah-langkah Setup:

### 1. Install & Start XAMPP

1. Download XAMPP dari https://www.apachefriends.org/
2. Install XAMPP
3. Buka XAMPP Control Panel
4. **Start Apache** (untuk phpMyAdmin)
5. **Start MySQL** (untuk database)

### 2. Buat Database

Ada 2 cara:

#### **Cara 1: Menggunakan phpMyAdmin (Mudah)**

1. Buka browser, akses: `http://localhost/phpmyadmin`
2. Klik tab **"SQL"** di menu atas
3. Copy seluruh isi file `database_schema.sql`
4. Paste ke text area SQL
5. Klik tombol **"Go"** / **"Kirim"**
6. ✅ Database siap!

#### **Cara 2: Import File SQL**

1. Buka browser, akses: `http://localhost/phpmyadmin`
2. Klik **"New"** / **"Baru"** di sidebar kiri
3. Nama database: `web_kasir`
4. Klik **"Create"** / **"Buat"**
5. Klik database `web_kasir` yang baru dibuat
6. Klik tab **"Import"** di menu atas
7. Klik **"Choose File"**, pilih file `database_schema.sql`
8. Klik **"Go"** / **"Kirim"**
9. ✅ Database siap!

### 3. Konfigurasi Koneksi (Opsional)

Jika MySQL XAMPP menggunakan password, edit file `.env`:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=     # Default XAMPP kosong
MYSQL_DATABASE=web_kasir
```

### 4. Jalankan Aplikasi

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend (terminal baru)
cd client
npm start
```

### 5. Login

Buka browser: `http://localhost:3000`

**Login Admin:**
- Username: `admin`
- Password: `admin123`

**Login Kasir:**
- Username: `kasir1`
- Password: `admin123`

---

## 📊 Struktur Database

Database `web_kasir` memiliki tabel-tabel berikut:

### **Tabel Users**
- Menyimpan data user untuk login
- Role: admin, cashier
- Password di-hash dengan bcrypt

### **Tabel Products**
- Menyimpan data produk
- Kategori, harga, stok, SKU
- Auto update stok saat transaksi

### **Tabel Customers**
- Data pelanggan
- Loyalty points (1 point per Rp 1.000)
- Total spending & visit count

### **Tabel Employees**
- Data karyawan
- Gaji, posisi, status
- Hanya bisa diakses admin

### **Tabel Transactions**
- Riwayat transaksi
- Invoice number, payment method
- Link ke customer dan cashier

### **Tabel Transaction_Items**
- Detail item per transaksi
- Link ke products dan transactions

### **Tabel Categories**
- Kategori produk
- Foreign key ke products

---

## 🔧 Troubleshooting

### ❌ Error: "Access denied for user 'root'@'localhost'"
- Pastikan MySQL XAMPP sudah running
- Cek password di `.env` (default XAMPP kosong)

### ❌ Error: "Unknown database 'web_kasir'"
- Database belum dibuat
- Ikuti langkah 2 di atas

### ❌ Error: "Cannot connect to MySQL"
- Start MySQL di XAMPP Control Panel
- Pastikan port 3306 tidak diblok firewall

### ❌ Error: "Table doesn't exist"
- Import file `database_schema.sql` belum berhasil
- Ulangi langkah 2

---

## 🎯 Fitur Database

✅ **Auto Increment** untuk ID transaction items
✅ **Foreign Keys** untuk relasi antar tabel
✅ **Triggers** untuk auto update stock
✅ **Views** untuk reporting
✅ **Stored Procedures** untuk update customer stats
✅ **Indexes** untuk performa query

---

## 📝 Query Berguna

### Cek semua tabel:
```sql
SHOW TABLES;
```

### Lihat data produk:
```sql
SELECT * FROM products;
```

### Lihat transaksi hari ini:
```sql
SELECT * FROM transactions 
WHERE DATE(created_at) = CURDATE();
```

### Reset database (hati-hati!):
```sql
DROP DATABASE web_kasir;
```
Lalu import ulang `database_schema.sql`

---

## ✨ Data Default

Database sudah terisi dengan:
- 2 users (admin & kasir1)
- 4 products contoh
- 4 categories
- 1 customer umum
- 2 employees

Semua siap untuk digunakan langsung!

---

**Selamat menggunakan Web Kasir dengan MySQL! 🎉**
