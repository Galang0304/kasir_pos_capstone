const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/mysql');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all employees (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [employees] = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(employees.map(e => ({
      id: e.id,
      name: e.name,
      position: e.position,
      phone: e.phone,
      email: e.email,
      salary: parseFloat(e.salary),
      joinDate: e.join_date,
      status: e.status,
      createdAt: e.created_at
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get employee by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [employees] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (employees.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const e = employees[0];
    res.json({
      id: e.id,
      name: e.name,
      position: e.position,
      phone: e.phone,
      email: e.email,
      salary: parseFloat(e.salary),
      joinDate: e.join_date,
      status: e.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create employee (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = uuidv4();
    const { name, position, phone, email, salary, joinDate, status } = req.body;
    
    await db.query(
      'INSERT INTO employees (id, name, position, phone, email, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, position, phone, email, salary, joinDate, status || 'active']
    );
    
    const [newEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    const e = newEmployee[0];
    
    res.status(201).json({
      id: e.id,
      name: e.name,
      position: e.position,
      phone: e.phone,
      email: e.email,
      salary: parseFloat(e.salary),
      joinDate: e.join_date,
      status: e.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update employee (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, position, phone, email, salary, joinDate, status } = req.body;
    
    await db.query(
      'UPDATE employees SET name = ?, position = ?, phone = ?, email = ?, salary = ?, join_date = ?, status = ? WHERE id = ?',
      [name, position, phone, email, salary, joinDate, status, req.params.id]
    );
    
    const [updatedEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (updatedEmployee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const e = updatedEmployee[0];
    res.json({
      id: e.id,
      name: e.name,
      position: e.position,
      phone: e.phone,
      email: e.email,
      salary: parseFloat(e.salary),
      joinDate: e.join_date,
      status: e.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete employee (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
