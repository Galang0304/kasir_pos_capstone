const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/mysql');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Get all products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    let params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const id = uuidv4();
    const { name, category, price, stock, sku, description, image_url } = req.body;
    
    // Get category_id from category name
    const [categoryResult] = await db.query('SELECT id FROM categories WHERE name = ?', [category]);
    const category_id = categoryResult.length > 0 ? categoryResult[0].id : 1;
    
    await db.query(
      'INSERT INTO products (id, name, category_id, price, stock, sku, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, category_id, price, stock, sku, description, image_url || 'https://via.placeholder.com/150']
    );
    
    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(newProduct[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Update product request:', req.params.id, req.body);
    const { name, category, price, stock, sku, description, image_url } = req.body;
    
    // Get category_id from category name if category is provided
    let category_id = null;
    if (category) {
      const [categoryResult] = await db.query('SELECT id FROM categories WHERE name = ?', [category]);
      category_id = categoryResult.length > 0 ? categoryResult[0].id : null;
    }
    
    // If category_id is not found, keep the existing one
    if (category_id) {
      await db.query(
        'UPDATE products SET name = ?, category_id = ?, price = ?, stock = ?, sku = ?, description = ?, image = ? WHERE id = ?',
        [name, category_id, price, stock, sku, description, image_url, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE products SET name = ?, price = ?, stock = ?, sku = ?, description = ?, image = ? WHERE id = ?',
        [name, price, stock, sku, description, image_url, req.params.id]
      );
    }
    
    const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Product updated successfully:', updatedProduct[0]);
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get categories
router.get('/meta/categories', authMiddleware, async (req, res) => {
  try {
    const [categories] = await db.query('SELECT name FROM categories ORDER BY name');
    res.json(categories.map(c => c.name));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload product image
router.post('/upload-image', authMiddleware, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary error:', err);
      return res.status(500).json({ 
        message: 'Image upload failed', 
        error: err.message || 'Unknown error' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    console.log('Upload successful:', req.file.path);
    res.json({
      success: true,
      imageUrl: req.file.path,
      message: 'Image uploaded successfully'
    });
  });
});

module.exports = router;
