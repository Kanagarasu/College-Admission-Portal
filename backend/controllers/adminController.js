const Application = require('../models/Application');
const User = require('../models/User');
const Document = require('../models/Document');
const { asyncHandler } = require('../utils/errorResponse');
const { APPLICATION_STATUS } = require('../config/constants');
const { sendApplicationStatusEmail } = require('../utils/emailService');

// @desc    Get all applications (Admin)
// @route   GET /api/admin/applications
// @access  Private/Admin
// exports.getAllApplications = asyncHandler(async (req, res) => {
//   const {
//     status,
//     course,
//     page = 1,
//     limit = 10,
//     sortBy = 'submittedAt',
//     sortOrder = 'desc'
//   } = req.query;

//   let query = {};
  
//   if (status) query.status = status;
//   if (course) query['coursePreferences.firstChoice'] = course;

//   const sort = {};
//   sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

//   const options = {
//     page: parseInt(page, 10),
//     limit: parseInt(limit, 10),
//     sort,
//     populate: [
//       { path: 'student', select: 'name email phone' },
//       { path: 'reviewedBy', select: 'name email' }
//     ]
//   };

//   const applications = await Application.paginate(query, options);

//   res.status(200).json({
//     success: true,
//     count: applications.totalDocs,
//     data: applications.docs,
//     pagination: {
//       total: applications.totalDocs,
//       page: applications.page,
//       pages: applications.totalPages,
//       limit: applications.limit
//     }
//   });
// });
// controllers/admin.controller.js

exports.getAllApplications = asyncHandler(async (req, res) => {
  const { status, course, page = 1, limit = 10 } = req.query;

  let query = {};
  if (status) query.status = status;
  if (course) query.course = course;

  const skip = (page - 1) * limit;

  const applications = await Application.find(query)
    .populate("student", "name email phone")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Application.countDocuments(query);

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit)
    }
  });
});


// @desc    Get application by ID (Admin)
// @route   GET /api/admin/applications/:id
// @access  Private/Admin
exports.getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('student', 'name email phone dateOfBirth gender address')
    .populate('documents')
    .populate('reviewedBy', 'name email');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  res.status(200).json({
    success: true,
    application
  });
});

// @desc    Update application status (Admin)
// @route   PUT /api/admin/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;
  
  // console.log(status);

  // console.log(Object.values(APPLICATION_STATUS).includes(status));

  // Validate status
  if (!Object.values(APPLICATION_STATUS).includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const application = await Application.findById(id).populate('student');
  
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Update application
  application.status = status;
  application.remarks = remarks || '';
  application.reviewedAt = new Date();
  application.reviewedBy = req.user.id;

  await application.save();

  // Send email notification
  try {
    await sendApplicationStatusEmail(
      application.student.email,
      application.student.name,
      status,
      remarks
    );
  } catch (emailError) {
    console.error('Failed to send status email:', emailError);
  }

  res.status(200).json({
    success: true,
    message: `Application ${status} successfully`,
    application
  });
});

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    totalStudents,
    totalDocuments,
    recentApplications
  ] = await Promise.all([
    Application.countDocuments(),
    Application.countDocuments({ status: APPLICATION_STATUS.PENDING }),
    Application.countDocuments({ status: APPLICATION_STATUS.APPROVED }),
    Application.countDocuments({ status: APPLICATION_STATUS.REJECTED }),
    User.countDocuments({ role: 'student' }),
    Document.countDocuments(),
    Application.find()
      .populate('student', 'name email')
      .sort({ submittedAt: -1 })
      .limit(5)
  ]);

  // Course-wise distribution
  const courseDistribution = await Application.aggregate([
    {
      $group: {
        _id: '$coursePreferences.firstChoice',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Monthly application trends
  const monthlyTrends = await Application.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$submittedAt' },
          month: { $month: '$submittedAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications
      },
      users: {
        totalStudents,
        totalDocuments
      },
      distribution: {
        courses: courseDistribution,
        monthlyTrends
      },
      recentApplications
    }
  });
});

// @desc    Verify document (Admin)
// @route   PUT /api/admin/documents/:id/verify
// @access  Private/Admin
exports.verifyDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isVerified, verificationNotes } = req.body;

  const document = await Document.findByIdAndUpdate(
    id,
    {
      isVerified,
      verificationNotes
    },
    { new: true, runValidators: true }
  ).populate('student', 'name email');

  if (!document) {
    return res.status(404).json({
      success: false,
      message: 'Document not found'
    });
  }

  res.status(200).json({
    success: true,
    message: `Document ${isVerified ? 'verified' : 'unverified'} successfully`,
    document
  });
});

// @desc    Search applications (Admin)
// @route   GET /api/admin/search
// @access  Private/Admin
exports.searchApplications = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 3 characters'
    });
  }

  const applications = await Application.find({
    $or: [
      { 'personalDetails.fullName': { $regex: query, $options: 'i' } },
      { 'personalDetails.fatherName': { $regex: query, $options: 'i' } }
    ]
  })
    .populate('student', 'name email phone')
    .limit(20);

  res.status(200).json({
    success: true,
    count: applications.length,
    applications
  });
});