const jwt = require('jsonwebtoken');
const model = require('../model/User');
const UserModel = model.User;
const modelB = require('../model/Branch');
const BranchModel = modelB.Branch;

require('dotenv').config()
console.log('Environment variables:', { 
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('WARNING: JWT_SECRET is not set in environment variables. This is a security risk.');
}

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied',
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Find user
    let user;
    if (decoded.role === 'branchManager') {
      user = await BranchModel.findById(decoded.id);
      console.log('Found branch manager:', user ? 'Yes' : 'No');
    } else {
      user = await UserModel.findById(decoded.id);
      console.log('Found user:', user ? 'Yes' : 'No');
    }

    if (!user) {
      console.log('User not found for id:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user and role to request
    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired, please login again',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
}; 