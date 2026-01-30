const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

// Protect routes - user must be authenticated
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Check if user is student
exports.isStudent = (req, res, next) => {
  if (req.user.role !== ROLES.STUDENT) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student privileges required.'
    });
  }
  next();
};

// Check if user owns the resource
exports.checkOwnership = (modelName) => {
  return async (req, res, next) => {
    try {
      let resource;
      
      switch (modelName) {
        case 'Application':
          const Application = require('../models/Application');
          resource = await Application.findById(req.params.id);
          break;
        case 'Document':
          const Document = require('../models/Document');
          resource = await Document.findById(req.params.id);
          break;
        default:
          return res.status(500).json({
            success: false,
            message: 'Invalid model name'
          });
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if user owns the resource or is admin
      if (resource.student.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
};