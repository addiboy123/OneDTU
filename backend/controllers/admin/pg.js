const PG = require('../../models/FindMySpace/PG'); // Adjust path to your PG model
const PGPost = require('../../models/FindMySpace/PGPost'); // Adjust path to PGPost model
const User = require('../../models/User'); // Adjust path to User model
const { BadRequestError, NotFoundError } = require('../../errors');
const { uploadImage, deleteFile } = require('../../util/cloud'); // Import cloud utility functions

/**
 * @desc    Create a new PG with image uploads
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
    throw new BadRequestError('Title, description, pricePerPerson, mess_fee, googleMapLink, and distanceFromDtu are required.');
  }

  // 1. Handle image uploads to Cloudinary
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadImage(file.buffer));
    const uploadResults = await Promise.all(uploadPromises);
    imageUrls = uploadResults.map(result => result.secure_url || result.url);
  }
  
  // 2. Add image URLs to the data before creating the document
  const pgData = { ...req.body, images: imageUrls };
  
  const pg = await PG.create(pgData);

  res.status(201).json({ message: 'PG created successfully', pg });
};

/**
 * @desc    Update an existing PG, including its images
 * @route   PUT /api/v1/admin/update-pg
 * @access  Private (Admin)
 */
exports.updatePG = async (req, res) => {
  const { pgId } = req.body;

  if (!pgId) {
    throw new BadRequestError('pgId is required to update');
  }

  const pg = await PG.findById(pgId);
  if (!pg) {
    throw new NotFoundError(`No PG found with id: ${pgId}`);
  }

  // Update text fields
  Object.assign(pg, req.body);

  // 1. Handle deletion of existing images
  let deletedImages = req.body.deletedImages;
  if (deletedImages) {
    const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(url => deleteFile(url)));
      pg.images = pg.images.filter(imgUrl => !imagesToDelete.includes(imgUrl));
    }
  }

  // 2. Handle upload of new images
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadImage(file.buffer));
    const uploadResults = await Promise.all(uploadPromises);
    const newImageUrls = uploadResults.map(result => result.secure_url || result.url);
    pg.images = [...pg.images, ...newImageUrls];
  }

  await pg.save();

  res.status(200).json({ message: 'PG updated successfully', pg });
};

/**
 * @desc    Delete a PG and all its associated data (posts, images, user refs)
 * @route   DELETE /api/v1/admin/delete-pg
 * @access  Private (Admin)
 */
exports.deletePG = async (req, res) => {
  const { pgId } = req.body;
  if (!pgId) {
    throw new BadRequestError('pgId is required');
  }

  const pg = await PG.findById(pgId);
  if (!pg) {
    throw new NotFoundError(`No PG found with id: ${pgId}`);
  }

  // --- Start Cleanup Process ---

  // 1. Delete all main images for the PG from Cloudinary
  if (pg.images && pg.images.length > 0) {
    await Promise.all(pg.images.map(url => deleteFile(url)));
  }

  // 2. Find and delete all associated room posts (PGPosts) and their images
  if (pg.posts && pg.posts.length > 0) {
    const associatedPosts = await PGPost.find({ _id: { $in: pg.posts } });
    
    // Delete room images from Cloudinary
    const roomImageDeletePromises = associatedPosts
      .filter(post => post.roomImage)
      .map(post => deleteFile(post.roomImage));
    await Promise.all(roomImageDeletePromises);

    // Delete the PGPost documents from the database
    await PGPost.deleteMany({ _id: { $in: pg.posts } });
  }

  // 3. Remove references to the deleted PGPosts from all users' documents
  await User.updateMany(
    { 'Accomodations.PG': { $in: pg.posts } },
    { $pull: { 'Accomodations.PG': { $in: pg.posts } } }
  );
  
  // 4. Finally, delete the main PG document itself
  await PG.findByIdAndDelete(pgId);

  res.status(200).json({ message: 'PG and all associated data deleted successfully' });
};

