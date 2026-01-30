const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  getAllUsers,
  updateUserStatus
} = require('../controllers/userController');
const { protect, authorize, isAdmin, isStudent } = require('../middleware/authMiddleware');

// Student routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/dashboard', protect, isStudent, getDashboard);

// Admin routes (user management)
router.get('/', protect, isAdmin, getAllUsers);
router.put('/:id/status', protect, isAdmin, updateUserStatus);

module.exports = router;