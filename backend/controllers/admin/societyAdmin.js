const SocietyAdmin = require('../../models/SocietyAdmins');
const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError, NotFoundError } = require('../../errors');

/**
 * @desc    Create a new society admin
 * @route   POST /api/v1/admin/create-societyadmin
 * @access  Private (Admin)
 */
exports.createSocietyAdmin = async (req, res) => {
  const { name, phoneNumber, password, societyId } = req.body;
  if (!name || !phoneNumber || !password || !societyId) {
    throw new BadRequestError('Name, phoneNumber, password and societyId are required');
  }

  // Ensure society exists
  const society = await Society.findById(societyId);
  if (!society) throw new NotFoundError('Society not found');

  // Ensure phoneNumber uniqueness
  const existing = await SocietyAdmin.findOne({ phoneNumber });
  if (existing) throw new BadRequestError('Society admin with this phone number already exists');

  const sa = await SocietyAdmin.create({ name, phoneNumber, password, society: societyId });

  res.status(201).json({
    message: 'Society admin created successfully',
    societyAdmin: { id: sa._id, name: sa.name, phoneNumber: sa.phoneNumber, society: sa.society }
  });
};

/**
 * @desc    Update an existing society admin
 * @route   PUT /api/v1/admin/update-societyadmin
 * @access  Private (Admin)
 */
exports.updateSocietyAdmin = async (req, res) => {
  const { societyAdminId, name, phoneNumber, password, societyId } = req.body;

  if (!societyAdminId) {
    throw new BadRequestError('societyAdminId is required to update');
  }

  // Find the society admin to be updated
  const societyAdmin = await SocietyAdmin.findById(societyAdminId);
  if (!societyAdmin) {
    throw new NotFoundError(`No society admin found with id: ${societyAdminId}`);
  }

  // If phone number is being updated, check for uniqueness among other admins
  if (phoneNumber && phoneNumber !== societyAdmin.phoneNumber) {
    const existing = await SocietyAdmin.findOne({ phoneNumber });
    if (existing) {
      throw new BadRequestError('Another society admin with this phone number already exists');
    }
    societyAdmin.phoneNumber = phoneNumber;
  }

  // If society is being updated, ensure the new society exists
  if (societyId && societyAdmin.society.toString() !== societyId) {
    const society = await Society.findById(societyId);
    if (!society) throw new NotFoundError('The specified society was not found');
    societyAdmin.society = societyId;
  }

  // Update other fields if provided
  if (name) societyAdmin.name = name;
  if (password) societyAdmin.password = password; // The pre-save hook will hash this

  await societyAdmin.save();

  res.status(200).json({
    message: 'Society admin updated successfully',
    societyAdmin: {
      id: societyAdmin._id,
      name: societyAdmin.name,
      phoneNumber: societyAdmin.phoneNumber,
      society: societyAdmin.society
    }
  });
};

/**
 * @desc    Delete a society admin
 * @route   DELETE /api/v1/admin/delete-societyadmin
 * @access  Private (Admin)
 */
exports.deleteSocietyAdmin = async (req, res) => {
  const { societyAdminId } = req.body;
  if (!societyAdminId) {
    throw new BadRequestError('societyAdminId is required');
  }

  const societyAdmin = await SocietyAdmin.findByIdAndDelete(societyAdminId);

  if (!societyAdmin) {
    throw new NotFoundError(`No society admin found with id: ${societyAdminId}`);
  }

  res.status(200).json({ message: 'Society admin deleted successfully' });
};
