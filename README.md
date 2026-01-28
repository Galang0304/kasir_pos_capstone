# 💼 Web Kasir - Sistem POS Modern

Aplikasi kasir lengkap seperti majoo.id dengan fitur-fitur professional untuk manajemen bisnis.

## 🚀 Fitur Utama

### 📊 Point of Sale (POS/Kasir)
- ✅ Interface kasir yang intuitif dan cepat
- ✅ Keranjang belanja dengan update real-time
- ✅ Multiple payment methods (Cash, Debit, Credit, E-Wallet)
- ✅ Pencarian dan filter produk
- ✅ Customer selection untuk loyalty program
- ✅ Diskon dan perhitungan kembalian otomatis

### 📦 Manajemen Produk
- ✅ CRUD produk lengkap
- ✅ Kategori produk
- ✅ SKU dan barcode ready
- ✅ Stock management
- ✅ Harga dan deskripsi produk

### 📈 Dashboard & Analytics
- ✅ Dashboard real-time
- ✅ Statistik penjualan hari ini vs total
- ✅ Produk terlaris
- ✅ Transaksi terakhir
- ✅ Alert stok menipis
- ✅ Grafik penjualan (harian, bulanan, tahunan)

### 👥 Manajemen Pelanggan (CRM)
- ✅ Database pelanggan
- ✅ Loyalty points system
- ✅ Riwayat transaksi pelanggan
- ✅ Total spending tracking
- ✅ Visit count

### 🏢 Manajemen Karyawan
- ✅ CRUD karyawan (Admin only)
- ✅ Role-based access control
- ✅ Data gaji dan posisi
- ✅ Status karyawan (active/inactive)

### 📊 Laporan
- ✅ Laporan penjualan
- ✅ Grafik analitik (Line & Bar charts)
- ✅ Filter periode (harian, bulanan, tahunan)
- ✅ Export ready

### 🔒 Authentication & Authorization
- ✅ Login system dengan JWT
- ✅ Role-based access (Admin & Cashier)
- ✅ Protected routes
- ✅ Session management

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- Recharts (untuk grafik)
- React Icons

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- In-memory Database (mudah diganti dengan MongoDB/PostgreSQL)

## 📦 Instalasi

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Jalankan Aplikasi

**Development Mode (Backend + Frontend):**
```bash
npm run dev
```

**Backend Only:**
```bash
npm run server
```

**Frontend Only:**
```bash
npm run client
```

**Production:**
```bash
npm start
```

## 🔑 Demo Login

### Admin Account
- Username: `admin`
- Password: `admin123`
- Akses: Full access (semua fitur)

### Kasir Account
- Username: `kasir1`
- Password: `admin123`
- Akses: Limited (tidak bisa manage karyawan)

## 📱 Fitur per Halaman

### 1. Dashboard (`/`)
- Overview statistik bisnis
- Penjualan hari ini
- Produk terlaris
- Transaksi terakhir
- Alert stok menipis

### 2. Kasir (`/kasir`)
- POS interface
- Pilih produk
- Kelola keranjang
- Pilih pelanggan
- Checkout dengan berbagai metode pembayaran
- Perhitungan otomatis

### 3. Produk (`/products`)
- Daftar semua produk
- Tambah produk baru
- Edit produk
- Hapus produk
- Search & filter

### 4. Inventori (`/inventory`)
- Summary inventori
- Nilai total inventori
- Daftar stok
- Alert stok rendah

### 5. Pelanggan (`/customers`)
- Database pelanggan
- Loyalty points
- Total belanja
- Jumlah kunjungan
- CRUD pelanggan

### 6. Transaksi (`/transactions`)
- Riwayat semua transaksi
- Detail invoice
- Filter dan search
- Status pembayaran

### 7. Laporan (`/reports`)
- Grafik penjualan
- Analisis periode
- Total penjualan
- Rata-rata transaksi

### 8. Karyawan (`/employees`) - Admin Only
- Manajemen karyawan
- Data gaji
- Status karyawan
- CRUD karyawan

## 🎨 Design Highlights

- Modern gradient UI
- Responsive design
- Smooth animations
- Intuitive navigation
- Professional color scheme
- Mobile-friendly (responsive)

## 📊 Database Schema

### Users
- id, username, password, name, role, email

### Products
- id, name, category, price, stock, sku, image, description

### Customers
- id, name, phone, email, address, points, totalSpent, visitCount

### Employees
- id, name, position, phone, email, salary, joinDate, status

### Transactions
- id, invoiceNumber, items[], customer, paymentMethod, subtotal, discount, total, amountPaid, change, cashier, status

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction (checkout)

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Employees (Admin Only)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Reports
- `GET /api/reports/dashboard` - Dashboard stats
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/inventory` - Inventory report

### Inventory
- `GET /api/inventory/summary` - Inventory summary
- `POST /api/inventory/update-stock` - Update stock

## 🚀 Future Enhancements

- [ ] Integrasi database MySQL/PostgreSQL/MongoDB
- [ ] Export laporan ke PDF/Excel
- [ ] Barcode scanner integration
- [ ] Print receipt/invoice
- [ ] WhatsApp notification
- [ ] Multi-branch support
- [ ] Advanced analytics
- [ ] Backup & restore
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 📝 Notes

- Default port backend: `5000`
- Default port frontend: `3000`
- JWT Secret dapat diubah di file `.env`
- Database saat ini menggunakan in-memory (data hilang saat restart)
- Untuk production, ganti dengan database persistent

## 👨‍💻 Development

Aplikasi ini dibuat dengan arsitektur modern:
- **Frontend**: React dengan hooks dan context API
- **Backend**: RESTful API dengan Express
- **Authentication**: JWT-based authentication
- **State Management**: React Context
- **UI/UX**: Custom CSS dengan gradient modern

## 📄 License

MIT License - Bebas digunakan untuk pembelajaran dan komersial.

---

**Selamat menggunakan Web Kasir! 💼✨**
