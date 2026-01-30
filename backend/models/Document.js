const mongoose = require('mongoose');
const { DOCUMENT_TYPES } = require('../config/constants');

const documentSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentType: {
    type: String,
    enum: Object.values(DOCUMENT_TYPES),
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  publicId: String, // For Cloudinary
  fileSize: Number,
  mimeType: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationNotes: String
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;