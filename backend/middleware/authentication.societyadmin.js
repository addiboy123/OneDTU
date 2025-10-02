const SocietyAdmin = require('../models/SocietyAdmins');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationSocietyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('Token not found');
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // try to find society admin by payload id
    const sa = await SocietyAdmin.findById(payload.userId);
    if (!sa) throw new UnauthenticatedError('Not authorized as society admin');

    // attach society admin info to request
    req.societyAdmin = { id: sa._id, name: sa.name, society: sa.society };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
};

module.exports = authenticationSocietyAdmin;
