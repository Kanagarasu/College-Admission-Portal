// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { ROLES } = require('../config/constants');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false
//   },
//   role: {
//     type: String,
//     enum: [ROLES.STUDENT, ROLES.ADMIN],
//     default: ROLES.STUDENT
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
//   },
//   dateOfBirth: {
//     type: Date,
//     required: [true, 'Date of birth is required']
//   },
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true
//   },
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     pincode: String,
//     country: {
//       type: String,
//       default: 'India'
//     }
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Update timestamp on update
// userSchema.pre('findOneAndUpdate', function(next) {
//   this.set({ updatedAt: Date.now() });
//   next();
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: [ROLES.STUDENT, ROLES.ADMIN],
    default: ROLES.STUDENT
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// ------------------------
// Hash password before saving
// ------------------------
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // Mongoose handles async, no next() needed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ------------------------
// Compare password method
// ------------------------
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ------------------------
// Update timestamp on findOneAndUpdate
// ------------------------
userSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: Date.now() });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
