const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const { authMiddleware } = require('../middleware/auth');

// Get inventory summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as totalProducts,
        COALESCE(SUM(stock), 0) as totalStock,
        COALESCE(SUM(stock * price), 0) as totalValue,
        SUM(CASE WHEN stock < 10 THEN 1 ELSE 0 END) as lowStock,
        SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as outOfStock
      FROM products
    `);
    
    res.json({
      totalProducts: stats[0].totalProducts,
      totalStock: parseInt(stats[0].totalStock),
      totalValue: parseFloat(stats[0].totalValue),
      lowStock: stats[0].lowStock,
      outOfStock: stats[0].outOfStock
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update stock
router.post('/update-stock', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, type } = req.body;
    
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    
    if (type === 'add') {
      await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, productId]);
    } else if (type === 'subtract') {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);
    }
    
    const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    res.json(updatedProduct[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
