import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FaMoneyBillWave, FaReceipt, FaUsers, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/reports/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Penjualan Hari Ini</h3>
            <p className="stat-value">{formatRupiah(stats.today.sales)}</p>
            <span className="stat-label">{stats.today.transactions} transaksi</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <FaReceipt />
          </div>
          <div className="stat-content">
            <h3>Total Penjualan</h3>
            <p className="stat-value">{formatRupiah(stats.total.sales)}</p>
            <span className="stat-label">{stats.total.transactions} transaksi</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Pelanggan</h3>
            <p className="stat-value">{stats.total.customers}</p>
            <span className="stat-label">pelanggan terdaftar</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <FaBox />
          </div>
          <div className="stat-content">
            <h3>Total Produk</h3>
            <p className="stat-value">{stats.total.products}</p>
            <span className="stat-label">produk aktif</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Best Selling Products */}
        <div className="dashboard-card">
          <h2>Produk Terlaris</h2>
          <div className="best-selling-list">
            {stats.bestSelling.map((product, index) => (
              <div key={index} className="best-selling-item">
                <div className="rank">{index + 1}</div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.totalSold} terjual - {formatRupiah(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-card">
          <h2>Transaksi Terakhir</h2>
          <div className="recent-transactions">
            {stats.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div>
                  <h4>{transaction.invoiceNumber}</h4>
                  <p className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="transaction-amount">
                  {formatRupiah(transaction.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <div className="dashboard-card alert">
            <h2><FaExclamationTriangle /> Stok Menipis</h2>
            <div className="low-stock-list">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="low-stock-item">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>SKU: {product.sku}</p>
                  </div>
                  <div className="stock-badge danger">
                    {product.stock} unit
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
