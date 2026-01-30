const User = require('../models/User');
const Application = require('../models/Application');
const { asyncHandler } = require('../utils/errorResponse');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, dateOfBirth, gender, address } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      phone,
      dateOfBirth,
      gender,
      address
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private (Student only)
exports.getDashboard = asyncHandler(async (req, res) => {
  const [application, user] = await Promise.all([
    Application.findOne({ student: req.user.id })
      .populate('documents')
      .sort({ createdAt: -1 }),
    User.findById(req.user.id)
  ]);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastLogin: user.lastLogin
      },
      application,
      stats: {
        documentsUploaded: application ? application.documents.length : 0,
        applicationStatus: application ? application.status : 'not_submitted'
      }
    }
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
// exports.getAllUsers = asyncHandler(async (req, res) => {
//   const { role, isActive, page = 1, limit = 10 } = req.query;
  
//   let query = {};
  
//   if (role) query.role = role;
//   if (isActive !== undefined) query.isActive = isActive === 'true';

//   const options = {
//     page: parseInt(page, 10),
//     limit: parseInt(limit, 10),
//     sort: { createdAt: -1 }
//   };

//   const users = await User.paginate(query, options);

//   res.status(200).json({
//     success: true,
//     count: users.totalDocs,
//     data: users.docs,
//     pagination: {
//       total: users.totalDocs,
//       page: users.page,
//       pages: users.totalPages,
//       limit: users.limit
//     }
//   });
// });

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, isActive, page = 1, limit = 10 } = req.query;

  let query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit)
    }
  });
});


// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    user
  });
});