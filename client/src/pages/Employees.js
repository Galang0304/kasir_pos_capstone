import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../pages/Products.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: '',
    email: '',
    salary: '',
    joinDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        await axios.put(`/employees/${editingEmployee.id}`, formData);
        alert('Karyawan berhasil diupdate!');
      } else {
        await axios.post('/employees', formData);
        alert('Karyawan berhasil ditambahkan!');
      }
      
      fetchEmployees();
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan karyawan: ' + error.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus karyawan ini?')) {
      try {
        await axios.delete(`/employees/${id}`);
        alert('Karyawan berhasil dihapus!');
        fetchEmployees();
      } catch (error) {
        alert('Gagal menghapus karyawan: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      phone: '',
      email: '',
      salary: '',
      joinDate: '',
      status: 'active'
    });
    setEditingEmployee(null);
    setShowModal(false);
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Manajemen Karyawan</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Tambah Karyawan
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="products-table-wrapper desktop-view">
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Posisi</th>
                <th>Telepon</th>
                <th>Email</th>
                <th>Gaji</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.email}</td>
                  <td>{formatRupiah(employee.salary)}</td>
                  <td>
                    <span className={`stock-badge ${employee.status === 'active' ? '' : 'low'}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(employee)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(employee.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="products-cards mobile-view">
        {employees.map(employee => (
          <div key={employee.id} className="product-card">
            <div className="product-card-header">
              <div>
                <h3>{employee.name}</h3>
                <p className="product-sku">{employee.position}</p>
              </div>
              <span className={`stock-badge ${employee.status === 'active' ? '' : 'low'}`}>
                {employee.status}
              </span>
            </div>
            <div className="product-card-body">
              <div className="transaction-info">
                <div className="info-row">
                  <span className="info-label">Telepon</span>
                  <span className="info-value">{employee.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value" style={{ fontSize: '13px' }}>{employee.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Gaji</span>
                  <span className="info-value">{formatRupiah(employee.salary)}</span>
                </div>
              </div>
            </div>
            <div className="product-card-actions">
              <button className="edit-btn" onClick={() => handleEdit(employee)}>
                <FaEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(employee.id)}>
                <FaTrash /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Posisi *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telepon *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gaji *</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal Bergabung *</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingEmployee ? 'Update' : 'Simpan'}
                </button>
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
