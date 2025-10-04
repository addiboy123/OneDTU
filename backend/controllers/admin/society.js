const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError, NotFoundError } = require('../../errors');

/**
 * @desc    Create a new society
 * @route   POST /api/v1/admin/create-society
 * @access  Private (Admin)
 */
exports.createSociety = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    throw new BadRequestError('Society name is required');
  }

  const existing = await Society.findOne({ name: name.trim() });
  if (existing) {
    throw new BadRequestError('Society with this name already exists');
  }

  const society = await Society.create({ name: name.trim() });

  res.status(201).json({ message: 'Society created', society: { id: society._id, name: society.name } });
};

/**
 * @desc    Update an existing society
 * @route   PUT /api/v1/admin/update-society
 * @access  Private (Admin)
 */
exports.updateSociety = async (req, res) => {
  const { societyId, ...updateData } = req.body;

  if (!societyId) {
    throw new BadRequestError('societyId is required to update');
  }

  // If the name is being updated, check for uniqueness
  if (updateData.name) {
    const trimmedName = updateData.name.trim();
    const existing = await Society.findOne({ name: trimmedName, _id: { $ne: societyId } });
    if (existing) {
      throw new BadRequestError('Another society with this name already exists');
    }
    updateData.name = trimmedName;
  }

  const society = await Society.findByIdAndUpdate(societyId, updateData, {
    new: true, // Return the updated document
    runValidators: true // Run schema validators on update
  });

  if (!society) {
    throw new NotFoundError(`No society found with id: ${societyId}`);
  }

  res.status(200).json({ message: 'Society updated successfully', society });
};


/**
 * @desc    Delete a society
 * @route   DELETE /api/v1/admin/delete-society
 * @access  Private (Admin)
 */
exports.deleteSociety = async (req, res) => {
  const { societyId } = req.body;
  if (!societyId) {
    throw new BadRequestError('societyId is required');
  }

  const society = await Society.findByIdAndDelete(societyId);

  if (!society) {
    throw new NotFoundError(`No society found with id: ${societyId}`);
  }

  // Optional: You might want to handle cleaning up related data here,
  // for example, deleting all posts associated with this society.
  // await Post.deleteMany({ _id: { $in: society.posts } });

  res.status(200).json({ message: 'Society deleted successfully' });
};
