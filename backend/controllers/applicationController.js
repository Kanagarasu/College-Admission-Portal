const Application = require('../models/Application');
const Document = require('../models/Document');
const User = require('../models/User');
const { asyncHandler } = require('../utils/errorResponse');
const { APPLICATION_STATUS } = require('../config/constants');

// @desc    Submit admission application
// @route   POST /api/applications
// @access  Private (Student only)
exports.submitApplication = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  // Check if student already has an application
  const existingApplication = await Application.findOne({ student: studentId });
  
  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already submitted an application'
    });
  }

  const {
    personalDetails,
    academicDetails,
    coursePreferences
  } = req.body;

  // Create application
  const application = await Application.create({
    student: studentId,
    personalDetails,
    academicDetails,
    coursePreferences,
    status: APPLICATION_STATUS.PENDING,
    submittedAt: new Date()
  });

  // Update user with application reference
  await User.findByIdAndUpdate(studentId, {
    $set: { updatedAt: new Date() }
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    application
  });
});

// @desc    Get student's application
// @route   GET /api/applications/my-application
// @access  Private (Student only)
exports.getMyApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ student: req.user.id })
    .populate('documents')
    .populate('reviewedBy', 'name email');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'No application found'
    });
  }

  res.status(200).json({
    success: true,
    application
  });
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private (Student only)
exports.updateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  // Check if application belongs to student
  const application = await Application.findOne({ _id: id, student: studentId });
  
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Don't allow updates if application is approved/rejected
  if (application.status !== APPLICATION_STATUS.PENDING) {
    return res.status(400).json({
      success: false,
      message: 'Cannot update application after review'
    });
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Application updated successfully',
    application: updatedApplication
  });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Student only)
exports.deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const application = await Application.findOne({ _id: id, student: studentId });
  
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Delete associated documents
  await Document.deleteMany({ application: id });

  // Delete application
  await Application.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Application deleted successfully'
  });
});

// @desc    Upload document for application
// @route   POST /api/applications/:id/documents
// @access  Private (Student only)
exports.uploadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;
  const { documentType } = req.body;

  // Check if application exists and belongs to student
  const application = await Application.findOne({ _id: id, student: studentId });
  
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  // Create document record
  const document = await Document.create({
    application: id,
    student: studentId,
    documentType,
    fileName: req.file.originalname,
    fileUrl: req.file.path,
    publicId: req.file.filename,
    fileSize: req.file.size,
    mimeType: req.file.mimetype
  });

  // Add document to application
  application.documents.push(document._id);
  await application.save();

  res.status(201).json({
    success: true,
    message: 'Document uploaded successfully',
    document
  });
});

// @desc    Get application documents
// @route   GET /api/applications/:id/documents
// @access  Private (Student/Admin)
exports.getApplicationDocuments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const documents = await Document.find({ application: id });

  res.status(200).json({
    success: true,
    count: documents.length,
    documents
  });
});

// @desc    Delete document
// @route   DELETE /api/applications/documents/:docId
// @access  Private (Student only)
exports.deleteDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const studentId = req.user.id;

  const document = await Document.findOne({ _id: docId, student: studentId });
  
  if (!document) {
    return res.status(404).json({
      success: false,
      message: 'Document not found'
    });
  }

  // Remove document from application
  await Application.findByIdAndUpdate(
    document.application,
    { $pull: { documents: docId } }
  );

  // Delete document record
  await Document.findByIdAndDelete(docId);

  res.status(200).json({
    success: true,
    message: 'Document deleted successfully'
  });
});