const mongoose = require('mongoose');
const { APPLICATION_STATUS, COURSES } = require('../config/constants');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalDetails: {
    fullName: String,
    fatherName: String,
    motherName: String,
    guardianPhone: String,
    nationality: {
      type: String,
      default: 'Indian'
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'Other'],
      default: 'General'
    }
  },
  academicDetails: {
    tenth: {
      board: String,
      school: String,
      passingYear: Number,
      percentage: Number,
      marksheetUrl: String
    },
    twelfth: {
      board: String,
      school: String,
      passingYear: Number,
      percentage: Number,
      marksheetUrl: String
    },
    entranceExam: {
      name: String,
      rollNumber: String,
      score: Number,
      rank: Number,
      scoreCardUrl: String
    }
  },
  coursePreferences: {
    firstChoice: {
      type: String,
      enum: COURSES,
      required: true
    },
    secondChoice: {
      type: String,
      enum: COURSES
    },
    thirdChoice: {
      type: String,
      enum: COURSES
    }
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  status: {
    type: String,
    enum: Object.values(APPLICATION_STATUS),
    default: APPLICATION_STATUS.PENDING
  },
  remarks: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPaymentCompleted: {
    type: Boolean,
    default: false
  },
  paymentDetails: {
    transactionId: String,
    amount: Number,
    date: Date,
    method: String
  }
}, {
  timestamps: true
});

// Create index for faster queries
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ submittedAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;