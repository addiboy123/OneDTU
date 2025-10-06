const User = require('../models/User');
const { BadRequestError, NotFoundError } = require('../errors');
const jwt = require('jsonwebtoken');

// Update authenticated user's phone number
exports.updatePhoneNumber = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) throw new BadRequestError('User not authenticated');

  const { phoneNumber } = req.body || {};
  if (!phoneNumber) throw new BadRequestError('phoneNumber is required');

  // basic validation: 10 digits
  if (!/^\d{10}$/.test(phoneNumber)) {
    throw new BadRequestError('phoneNumber must be a 10 digit number');
  }

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  // assign and save, handle duplicate key errors via try/catch
  user.phoneNumber = phoneNumber;
  try {
    await user.save();
  } catch (err) {
    // handle duplicate key for phoneNumber
    if (err.code === 11000 && err.keyPattern && err.keyPattern.phoneNumber) {
      throw new BadRequestError('phoneNumber already in use');
    }
    throw err;
  }

  // Optionally return updated user (omit sensitive fields)
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profile_photo_url: user.profile_photo_url,
  };

  // create new JWT with updated claims so frontend can refresh stored token
  const payload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ message: 'Phone number updated', user: safeUser, token });
};

module.exports = exports;
