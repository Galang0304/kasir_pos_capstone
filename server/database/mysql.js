const mysql = require('mysql2');

// Konfigurasi koneksi MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password kosong
  database: 'web_kasir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify untuk async/await
const promisePool = pool.promise();

// Test koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    console.log('⚠️  Pastikan XAMPP MySQL sudah running!');
    console.log('⚠️  Database "web_kasir" sudah dibuat!');
  } else {
    console.log('✅ MySQL Connected Successfully!');
    connection.release();
  }
});

module.exports = promisePool;
