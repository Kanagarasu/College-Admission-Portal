// const express = require('express');
// const router = express.Router();
// const {
//   register,
//   login,
//   getMe,
//   logout,
//   forgotPassword,
//   resetPassword,
//   createDefaultAdmin
// } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// // Public routes
// router.post('/register', register);
// router.post('/login', login);
// router.post('/forgot-password', forgotPassword);
// router.put('/reset-password/:resettoken', protect, resetPassword);
// router.post('/create-admin', createDefaultAdmin); // Remove in production

// // Protected routes
// router.get('/me', protect, getMe);
// router.get('/logout', protect, logout);

// module.exports = router;



const express = require('express');
const router = express.Router();
const { createDefaultAdmin,register ,login,getMe,logout,forgotPassword,resetPassword,} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Create default admin (run only once)
router.post('/create-admin', createDefaultAdmin);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.post('/forgot-password', forgotPassword );
router.put('/reset-password/:resettoken', protect, resetPassword);

module.exports = router;
