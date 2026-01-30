const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require('../config/constants');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Local storage
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and PDF are allowed.'), false);
  }
};

// Local upload
const upload = multer({
  storage: localStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

// Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college-admission',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf']
  }
});

// Cloud upload
const uploadToCloudinary = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

module.exports = { upload, uploadToCloudinary };
