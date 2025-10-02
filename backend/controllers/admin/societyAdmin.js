const SocietyAdmin = require('../../models/SocietyAdmins');
const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError, NotFoundError } = require('../../errors');

exports.createSocietyAdmin = async (req, res) => {
  const { name, phoneNumber, password, societyId } = req.body;
  if (!name || !phoneNumber || !password || !societyId) {
    throw new BadRequestError('name, phoneNumber, password and societyId are required');
  }

  // ensure society exists
  const society = await Society.findById(societyId);
  if (!society) throw new NotFoundError('Society not found');

  // ensure phoneNumber uniqueness
  const existing = await SocietyAdmin.findOne({ phoneNumber });
  if (existing) throw new BadRequestError('Society admin with this phone number already exists');

  const sa = await SocietyAdmin.create({ name, phoneNumber, password, society: societyId });

  res.status(201).json({ message: 'Society admin created', societyAdmin: { id: sa._id, name: sa.name, phoneNumber: sa.phoneNumber, society: sa.society } });
};
