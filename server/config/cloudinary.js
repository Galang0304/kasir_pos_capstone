const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpqpwpuou',
  api_key: '913946517353224',
  api_secret: 'j7rMJ-k2HcaZKSTgVIg6Lq4WWcA'
});

// Test configuration
cloudinary.api.ping().then(() => {
  console.log('✅ Cloudinary connected successfully');
}).catch((err) => {
  console.error('❌ Cloudinary connection failed:', err.message);
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'web_kasir/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = { cloudinary, upload };
