const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminOnly,
};
