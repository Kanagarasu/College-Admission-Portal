const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const applicationRoutes = require('./routes/applicationRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

// Import middleware
const {errorHandler} = require('./utils/errorResponse.js');

const app = express();

// Security middleware

// app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://college-admission-portal-1.onrender.com',
  credentials: true
}));
// app.use(morgan('dev'));

// Body parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files (if using local storage)

// app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'College Admission Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});



// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-admission')
  .then(() => {
    console.log(' MongoDB Connected Successfully');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(` API Documentation: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error(' MongoDB Connection Error:', err);
    process.exit(1);
  });

module.exports = app;