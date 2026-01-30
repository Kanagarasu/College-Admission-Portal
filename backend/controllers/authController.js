// const User = require('../models/User');
// const { generateToken } = require('../utils/generateToken');
// const { asyncHandler } = require('../utils/errorResponse');
// const { sendWelcomeEmail } = require('../utils/emailService');
// const { ROLES } = require('../config/constants');

// // @desc    Register user (student)
// // @route   POST /api/auth/register
// // @access  Public
// exports.register = asyncHandler(async (req, res, next) => {
//   const { name, email, password, phone, dateOfBirth, gender, address } = req.body;

//   // Check if user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.status(400).json({
//       success: false,
//       message: 'User already exists with this email'
//     });
//   }

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password,
//     phone,
//     dateOfBirth,
//     gender,
//     address,
//     role: ROLES.STUDENT
//   });

//   // Generate token
//   const token = generateToken(user);

//   // Send welcome email (optional)
//   try {
//     await sendWelcomeEmail(email, name);
//   } catch (emailError) {
//     console.error('Failed to send welcome email:', emailError);
//   }

//   res.status(201).json({
//     success: true,
//     message: 'User registered successfully',
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phone: user.phone
//     }
//   });
// });

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Validate email & password
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Please provide email and password'
//     });
//   }

//   // Check for user
//   const user = await User.findOne({ email }).select('+password');
  
//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid credentials'
//     });
//   }

//   // Check if user is active
//   if (!user.isActive) {
//     return res.status(401).json({
//       success: false,
//       message: 'Account is deactivated. Please contact admin.'
//     });
//   }

//   // Check password
//   const isMatch = await user.comparePassword(password);
  
//   if (!isMatch) {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid credentials'
//     });
//   }

//   // Update last login
//   user.lastLogin = Date.now();
//   await user.save();

//   // Generate token
//   const token = generateToken(user);

//   res.status(200).json({
//     success: true,
//     message: 'Login successful',
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phone: user.phone,
//       lastLogin: user.lastLogin
//     }
//   });
// });

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// exports.getMe = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user
//   });
// });

// // @desc    Logout user / clear cookie
// // @route   GET /api/auth/logout
// // @access  Private
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // @desc    Forgot password
// // @route   POST /api/auth/forgot-password
// // @access  Public
// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: 'No user found with this email'
//     });
//   }

//   // Generate reset token
//   const resetToken = generateToken(user);

//   // In production: Send email with reset link
//   // For now, return token (in production, don't return token)
//   res.status(200).json({
//     success: true,
//     message: 'Password reset instructions sent to email',
//     resetToken // Remove this in production
//   });
// });

// // @desc    Reset password
// // @route   PUT /api/auth/reset-password/:resettoken
// // @access  Public
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   const { password } = req.body;

//   // Get user from token (in production, verify token first)
//   const user = await User.findById(req.user.id);

//   if (!user) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }

//   // Set new password
//   user.password = password;
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: 'Password reset successful'
//   });
// });

// // @desc    Create default admin (run once)
// // @route   POST /api/auth/create-admin
// // @access  Public (remove after first use)
// exports.createDefaultAdmin = asyncHandler(async (req, res, next) => {
//   // Check if admin already exists
//   const adminExists = await User.findOne({ role: ROLES.ADMIN });
  
//   if (adminExists) {
//     return res.status(400).json({
//       success: false,
//       message: 'Admin already exists'
//     });
//   }

//   const admin = await User.create({
//     name: 'System Admin',
//     email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@college.edu',
//     password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
//     phone: '9999999999',
//     dateOfBirth: new Date('1990-01-01'),
//     gender: 'male',
//     role: ROLES.ADMIN,
//     address: {
//       street: 'Admin Street',
//       city: 'Admin City',
//       state: 'Admin State',
//       pincode: '000000'
//     }
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Default admin created successfully',
//     admin: {
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role
//     }
//   });
// });

// only for http://localhost:5000/api/auth/create-admin this

// const User = require('../models/User');
// const { ROLES } = require('../config/constants');
// const { asyncHandler } = require('../utils/errorResponse');

// exports.createDefaultAdmin = asyncHandler(async (req, res,next) => {
//   // Check if admin already exists
//   const adminExists = await User.findOne({ role: ROLES.ADMIN });

//   if (adminExists) {
//     return res.status(400).json({
//       success: false,
//       message: 'Admin already exists'
//     });
//   }

//   // Create admin
//   const admin = await User.create({
//     name: 'System Admin',
//     email: 'admin@college.com',
//     password: 'Admin@123',
//     phone: '9999999999',
//     dateOfBirth: new Date('1990-01-01'),
//     gender: 'male',
//     role: ROLES.ADMIN,
//     address: {
//       street: 'Admin Street',
//       city: 'Admin City',
//       state: 'Admin State',
//       pincode: '000000'
//     }
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Default admin created successfully',
//     admin: {
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role
//     }
//   });
// });



const User = require('../models/User');
const { ROLES } = require('../config/constants');
const { asyncHandler } = require('../utils/errorResponse');
const { generateToken } = require('../utils/generateToken'); // make sure you have this
const { sendWelcomeEmail } = require('../utils/emailService'); // optional

// Create default admin
exports.createDefaultAdmin = asyncHandler(async (req, res, next) => {
  // Check if admin already exists
  const adminExists = await User.findOne({ role: ROLES.ADMIN });

  if (adminExists) {
    return res.status(400).json({
      success: false,
      message: 'Admin already exists'
    });
  }

  // Create admin
  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@college.com',
    password: 'Admin@123',
    phone: '9999999999',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    role: ROLES.ADMIN,
    address: {
      street: 'Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      pincode: '000000'
    }
  });

  res.status(201).json({
    success: true,
    message: 'Default admin created successfully',
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

// Student registration
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, dateOfBirth, gender, address } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    dateOfBirth,
    gender,
    address,
    role: ROLES.STUDENT
  });

  // Generate token
  const token = generateToken(user);

  // // Send welcome email (optional)
  // try {
  //   await sendWelcomeEmail(email, name);
  // } catch (emailError) {
  //   console.error('Failed to send welcome email:', emailError);
  // }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  });
});

// User login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact admin.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'incorrect password credentials'
    });
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      lastLogin: user.lastLogin
    }
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});


exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});


exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with this email'
    });
  }

  // Generate reset token
  const resetToken = generateToken(user);

  // In production: Send email with reset link
  // For now, return token (in production, don't return token)
  res.status(200).json({
    success: true,
    message: 'Password reset instructions sent to email',
    resetToken // Remove this in production
  });
});


exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // Get user from token (in production, verify token first)
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Set new password
  user.password = password;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});