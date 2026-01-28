// Simple in-memory database (you can replace with MongoDB/PostgreSQL later)
const db = {
  users: [
    {
      id: '1',
      username: 'admin',
      password: '$2a$10$8OVnwOkLOEq.wjHxJFcPPuDnUmzG0QVa4g5P0Y6RQMjMGYZLKHhru', // password: admin123
      name: 'Administrator',
      role: 'admin',
      email: 'admin@kasir.com'
    },
    {
      id: '2',
      username: 'kasir1',
      password: '$2a$10$8OVnwOkLOEq.wjHxJFcPPuDnUmzG0QVa4g5P0Y6RQMjMGYZLKHhru', // password: admin123
      name: 'Kasir 1',
      role: 'cashier',
      email: 'kasir1@kasir.com'
    }
  ],
  
  products: [
    {
      id: '1',
      name: 'Nasi Goreng',
      category: 'Makanan',
      price: 15000,
      stock: 100,
      sku: 'FD001',
      image: 'https://via.placeholder.com/150',
      description: 'Nasi goreng spesial'
    },
    {
      id: '2',
      name: 'Mie Goreng',
      category: 'Makanan',
      price: 13000,
      stock: 80,
      sku: 'FD002',
      image: 'https://via.placeholder.com/150',
      description: 'Mie goreng enak'
    },
    {
      id: '3',
      name: 'Es Teh Manis',
      category: 'Minuman',
      price: 5000,
      stock: 200,
      sku: 'DR001',
      image: 'https://via.placeholder.com/150',
      description: 'Es teh manis segar'
    },
    {
      id: '4',
      name: 'Kopi Hitam',
      category: 'Minuman',
      price: 8000,
      stock: 150,
      sku: 'DR002',
      image: 'https://via.placeholder.com/150',
      description: 'Kopi hitam original'
    }
  ],
  
  customers: [
    {
      id: '1',
      name: 'Customer Umum',
      phone: '-',
      email: '-',
      address: '-',
      points: 0,
      totalSpent: 0,
      visitCount: 0
    }
  ],
  
  employees: [
    {
      id: '1',
      name: 'Admin User',
      position: 'Administrator',
      phone: '08123456789',
      email: 'admin@kasir.com',
      salary: 5000000,
      joinDate: '2024-01-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'Kasir 1',
      position: 'Cashier',
      phone: '08234567890',
      email: 'kasir1@kasir.com',
      salary: 3500000,
      joinDate: '2024-02-01',
      status: 'active'
    }
  ],
  
  transactions: [],
  
  categories: ['Makanan', 'Minuman', 'Snack', 'Lainnya']
};

module.exports = db;
