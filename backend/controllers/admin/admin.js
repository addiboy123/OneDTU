const Admin = require('../../models/Admin');
const { BadRequestError, UnauthenticatedError } = require('../../errors');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Name, email and password are required');
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new BadRequestError('Admin with this email already exists');
  }

  const admin = await Admin.create({ name, email, password });
  const token = admin.createJWT();

  res.status(201).json({
    message: 'Admin registered',
    admin: { id: admin._id, name: admin.name, email: admin.email },
    token,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError('Please provide email and password');

  const admin = await Admin.findOne({ email });
  if (!admin) throw new UnauthenticatedError('Invalid credentials');

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError('Invalid credentials');

  const token = admin.createJWT();
  res.status(200).json({ message: 'Logged in', token, admin: { id: admin._id, name: admin.name, email: admin.email } });
};
