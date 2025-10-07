const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('Token not found');
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Prefer role from token if present
    if (payload.role && payload.role === 'admin') {
      req.user = { userId: payload.userId, name: payload.name, role: payload.role };
      return next();
    }

    // Fallback: verify user exists and has admin role in DB
    const admin = await Admin.findById(payload.userId);
    if (!admin || admin.role !== 'admin') {
      throw new UnauthenticatedError('Not authorized as admin');
    }

    req.user = { userId: admin._id, name: admin.name, role: admin.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
};

module.exports = authenticationAdmin;
