import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    fetchSalesReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchSalesReport = async () => {
    try {
      const params = { groupBy: period };
      
      const response = await axios.get('/reports/sales', { params });
      setSalesData(response.data);
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalTransactions = salesData.reduce((sum, item) => sum + item.transactions, 0);
  const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <div className="dashboard">
      <h1>Laporan Penjualan</h1>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-content">
            <h3>Total Penjualan</h3>
            <p className="stat-value">{formatRupiah(totalSales)}</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-content">
            <h3>Total Transaksi</h3>
            <p className="stat-value">{totalTransactions}</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-content">
            <h3>Rata-rata per Transaksi</h3>
            <p className="stat-value">{formatRupiah(avgTransaction)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Grafik Penjualan</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={period === 'day' ? 'active category-badge' : 'category-badge'}
              onClick={() => setPeriod('day')}
              style={{ cursor: 'pointer', border: 'none', padding: '8px 16px', borderRadius: '8px' }}
            >
              Harian
            </button>
            <button
              className={period === 'month' ? 'active category-badge' : 'category-badge'}
              onClick={() => setPeriod('month')}
              style={{ cursor: 'pointer', border: 'none', padding: '8px 16px', borderRadius: '8px' }}
            >
              Bulanan
            </button>
            <button
              className={period === 'year' ? 'active category-badge' : 'category-badge'}
              onClick={() => setPeriod('year')}
              style={{ cursor: 'pointer', border: 'none', padding: '8px 16px', borderRadius: '8px' }}
            >
              Tahunan
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatRupiah(value)} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#2196F3" name="Penjualan" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        <h2>Grafik Transaksi</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="transactions" fill="#2196F3" name="Jumlah Transaksi" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
