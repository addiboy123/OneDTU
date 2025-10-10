const SocietyAdmin = require('../../models/SocietyAdmins');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../../errors');

exports.login = async (req, res) => {
    // console.log("Society admin login attempt");
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        throw new BadRequestError('phoneNumber and password are required');
    }

    const admin = await SocietyAdmin.findOne({ phoneNumber });
    if (!admin) throw new UnauthenticatedError('Invalid credentials');

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) throw new UnauthenticatedError('Invalid credentials');

    const token = jwt.sign(
        { userId: admin._id, name: admin.name, society: admin.society, role: 'societyAdmin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME || '1d' }
    );

    res.status(200).json({ message: 'Logged in', token, admin: { id: admin._id, name: admin.name, phoneNumber: admin.phoneNumber, society: admin.society } });
};
