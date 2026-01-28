import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FaBox, FaDollarSign, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './Dashboard.css';
import './Products.css';

const Inventory = () => {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const [summaryRes, productsRes] = await Promise.all([
        axios.get('/inventory/summary'),
        axios.get('/products')
      ]);
      setSummary(summaryRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!summary) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Manajemen Inventori</h1>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-content">
            <h3>Total Produk</h3>
            <p className="stat-value">{summary.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <h3>Total Stok</h3>
            <p className="stat-value">{summary.totalStock}</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-content">
            <h3>Nilai Inventori</h3>
            <p className="stat-value">{formatRupiah(summary.totalValue)}</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <div className="stat-content">
            <h3>Stok Rendah</h3>
            <p className="stat-value">{summary.lowStock}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        <h2>Daftar Inventori</h2>
        
        {/* Desktop Table View */}
        <div className="desktop-view" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', marginTop: '20px', minWidth: '600px' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#f8f9fa' }}>
                <th style={{ padding: '12px' }}>Produk</th>
                <th style={{ padding: '12px' }}>Kategori</th>
                <th style={{ padding: '12px' }}>Stok</th>
                <th style={{ padding: '12px' }}>Harga</th>
                <th style={{ padding: '12px' }}>Nilai Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{product.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`stock-badge ${product.stock < 10 ? 'danger' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{formatRupiah(product.price)}</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>
                    {formatRupiah(product.stock * product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-view">
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f3f5'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 6px 0', 
                      fontSize: '16px', 
                      fontWeight: '700', 
                      color: '#2d3748' 
                    }}>
                      {product.name}
                    </h3>
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <span className={`stock-badge ${product.stock < 10 ? 'danger' : ''}`} style={{
                    fontSize: '15px',
                    padding: '6px 14px',
                    marginLeft: '8px'
                  }}>
                    {product.stock}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f3f5'
                  }}>
                    <span style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Harga</span>
                    <span style={{ fontSize: '14px', color: '#2d3748', fontWeight: '700' }}>
                      {formatRupiah(product.price)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Nilai Total</span>
                    <span style={{ fontSize: '14px', color: '#2196F3', fontWeight: '700' }}>
                      {formatRupiah(product.stock * product.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
