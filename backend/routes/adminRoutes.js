const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getDashboardStats,
  verifyDocument,
  searchApplications
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Application management
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.put('/applications/:id/status', updateApplicationStatus);

// Document management
router.put('/documents/:id/verify', verifyDocument);

// Dashboard and search
router.get('/dashboard', getDashboardStats);
router.get('/search', searchApplications);

module.exports = router;