const PG = require('../../models/FindMySpace/PG'); // Adjust the path to your PG model as needed
const { BadRequestError, NotFoundError } = require('../../errors');

/**
 * @desc    Create a new PG
 * @route   POST /api/v1/admin/create-pg
 * @access  Private (Admin)
 */
exports.createPG = async (req, res) => {
  const {
    title,
    description,
    pricePerPerson,
    mess_fee,
    googleMapLink,
    distanceFromDtu
  } = req.body;

  if (!title || !description || !pricePerPerson || !mess_fee || !googleMapLink || !distanceFromDtu) {
    throw new BadRequestError('Title, description, pricePerPerson, mess_fee, googleMapLink, and distanceFromDtu are required fields.');
  }

  // Create a new PG object, including optional fields
  const pgData = { ...req.body };
  
  const pg = await PG.create(pgData);

  res.status(201).json({ message: 'PG created successfully', pg });
};

/**
 * @desc    Update an existing PG
 * @route   PUT /api/v1/admin/update-pg
 * @access  Private (Admin)
 */
exports.updatePG = async (req, res) => {
  const { pgId, ...updateData } = req.body;

  if (!pgId) {
    throw new BadRequestError('pgId is required to update');
  }

  const pg = await PG.findByIdAndUpdate(pgId, updateData, {
    new: true, // Return the modified document rather than the original
    runValidators: true // Ensures updates adhere to the schema
  });

  if (!pg) {
    throw new NotFoundError(`No PG found with id: ${pgId}`);
  }

  res.status(200).json({ message: 'PG updated successfully', pg });
};

/**
 * @desc    Delete a PG
 * @route   DELETE /api/v1/admin/delete-pg
 * @access  Private (Admin)
 */
exports.deletePG = async (req, res) => {
  const { pgId } = req.body;
  if (!pgId) {
    throw new BadRequestError('pgId is required');
  }

  const pg = await PG.findByIdAndDelete(pgId);

  if (!pg) {
    throw new NotFoundError(`No PG found with id: ${pgId}`);
  }
  
  // Note: This only deletes the PG document itself.
  // If you want to delete all associated room posts ('PGPost'),
  // you would need to add logic here to find and delete them.
  // Example: await PGPost.deleteMany({ _id: { $in: pg.posts } });

  res.status(200).json({ message: 'PG deleted successfully' });
};
