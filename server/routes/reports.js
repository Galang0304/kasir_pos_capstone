const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const { authMiddleware } = require('../middleware/auth');

// Get dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Today's stats
    const [todayStats] = await db.query(`
      SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(total_amount), 0) as total_sales
      FROM transactions
      WHERE DATE(created_at) = CURDATE()
    `);
    
    // Total stats
    const [totalStats] = await db.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_sales,
        COUNT(*) as transaction_count
      FROM transactions
    `);
    
    const [customerCount] = await db.query('SELECT COUNT(*) as count FROM customers');
    const [productCount] = await db.query('SELECT COUNT(*) as count FROM products');
    
    // Low stock products
    const [lowStockProducts] = await db.query('SELECT * FROM products WHERE stock < min_stock ORDER BY stock ASC LIMIT 10');
    
    // Best selling products
    const [bestSelling] = await db.query(`
      SELECT 
        p.id, p.name, p.sku, p.price,
        c.name as category,
        COALESCE(SUM(ti.quantity), 0) as totalSold,
        COALESCE(SUM(ti.subtotal), 0) as revenue
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN transaction_items ti ON p.id = ti.product_id
      GROUP BY p.id, p.name, p.sku, p.price, c.name
      ORDER BY totalSold DESC
      LIMIT 5
    `);
    
    // Recent transactions
    const [recentTransactions] = await db.query(`
      SELECT 
        t.id, 
        t.invoice_number as invoiceNumber,
        c.name as customer_name,
        t.total_amount as total,
        t.created_at as createdAt
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);
    
    res.json({
      today: {
        sales: parseFloat(todayStats[0].total_sales),
        transactions: todayStats[0].transaction_count
      },
      total: {
        sales: parseFloat(totalStats[0].total_sales),
        transactions: totalStats[0].transaction_count,
        customers: customerCount[0].count,
        products: productCount[0].count
      },
      lowStockProducts,
      bestSelling: bestSelling.map(b => ({
        ...b,
        totalSold: parseInt(b.totalSold),
        revenue: parseFloat(b.revenue)
      })),
      recentTransactions
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get sales report
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const { groupBy = 'day' } = req.query;
    
    let dateFormat;
    if (groupBy === 'day') {
      dateFormat = '%Y-%m-%d';
    } else if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    } else if (groupBy === 'year') {
      dateFormat = '%Y';
    }
    
    const [report] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, ?) as date,
        COALESCE(SUM(total), 0) as sales,
        COUNT(*) as transactions
      FROM transactions
      WHERE status = 'completed'
      GROUP BY DATE_FORMAT(created_at, ?)
      ORDER BY date ASC
    `, [dateFormat, dateFormat]);
    
    res.json(report.map(r => ({
      date: r.date,
      sales: parseFloat(r.sales),
      transactions: r.transactions
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get inventory report
router.get('/inventory', authMiddleware, async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT 
        p.*,
        COALESCE(SUM(ti.quantity), 0) as sold,
        (p.stock * p.price) as stockValue
      FROM products p
      LEFT JOIN transaction_items ti ON p.id = ti.product_id
      GROUP BY p.id
    `);
    
    res.json(report.map(r => ({
      ...r,
      sold: parseInt(r.sold),
      stockValue: parseFloat(r.stockValue)
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
