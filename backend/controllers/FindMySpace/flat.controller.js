const FlatPost = require('../../models/FindMySpace/FlatPosts'); // Ensure correct model path
const User = require('../../models/User'); // Import the User model
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../../errors');
const { uploadImage, deleteFile } = require('../../util/cloud'); // Import cloud utility functions

/**
 * @desc    Get all flat listings
 * @route   GET /api/v1/flats
 * @access  Public
 */
exports.getAllFlats = async (req, res) => {
    const flats = await FlatPost.find({}).sort('-createdAt');
    res.status(StatusCodes.OK).json({ count: flats.length, flats });
};

/**
 * @desc    Get a single flat by its ID
 * @route   GET /api/v1/flat/:id
 * @access  Public
 */
exports.getFlatById = async (req, res) => {
    const { id: flatId } = req.params;
    const flat = await FlatPost.findById(flatId);

    if (!flat) {
        throw new NotFoundError(`No flat found with id: ${flatId}`);
    }

    res.status(StatusCodes.OK).json({ flat });
};

/**
 * @desc    Create a new flat listing with image uploads
 * @route   POST /api/v1/flat
 * @access  Private
 */
exports.createFlat = async (req, res) => {
    // 1. Set the creator's ID
    req.body.createdBy = req.user.userId;

    // 2. Handle image uploads to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        // Create an array of upload promises
        const uploadPromises = req.files.map(file => uploadImage(file.buffer));
        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        // Get the secure URLs from the results
        imageUrls = uploadResults.map(result => result.secure_url || result.url);
    }
    req.body.images = imageUrls;

    // 3. Create the flat post document in the database
    const flat = await FlatPost.create(req.body);

    // 4. Add the new flat's ID to the user's document for reference
    await User.findByIdAndUpdate(
        req.user.userId,
        { $push: { 'Accomodations.Flat': flat._id } },
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.CREATED).json({ message: 'Flat listing created successfully', flat });
};

/**
 * @desc    Update a flat listing, including its images
 * @route   PUT /api/v1/flat/:id
 * @access  Private (Creator only)
 */
exports.updateFlat = async (req, res) => {
    const { id: flatId } = req.params;
    const { userId } = req.user;

    const flat = await FlatPost.findById(flatId);
    if (!flat) {
        throw new NotFoundError(`No flat found with id: ${flatId}`);
    }

    // Authorization check
    if (flat.createdBy.toString() !== userId) {
        throw new UnauthorizedError('You are not authorized to update this listing');
    }

    // Update text fields from req.body
    Object.assign(flat, req.body);
    
    // 1. Handle deletion of existing images
    let deletedImages = req.body.deletedImages;
    if (deletedImages) {
        // Ensure deletedImages is an array
        const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
        if (imagesToDelete.length > 0) {
            // Delete files from Cloudinary
            await Promise.all(imagesToDelete.map(url => deleteFile(url)));
            // Filter out the deleted images from the flat's image array
            flat.images = flat.images.filter(imgUrl => !imagesToDelete.includes(imgUrl));
        }
    }

    // 2. Handle upload of new images
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadImage(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);
        const newImageUrls = uploadResults.map(result => result.secure_url || result.url);
        // Add the new image URLs to the existing ones
        flat.images = [...flat.images, ...newImageUrls];
    }

    await flat.save();

    res.status(StatusCodes.OK).json({ message: 'Flat listing updated successfully', flat });
};

/**
 * @desc    Delete a flat listing and its images
 * @route   DELETE /api/v1/flat/:id
 * @access  Private (Creator only)
 */
exports.deleteFlat = async (req, res) => {
    const { id: flatId } = req.params;
    const { userId } = req.user;

    const flat = await FlatPost.findById(flatId);
    if (!flat) {
        throw new NotFoundError(`No flat found with id: ${flatId}`);
    }

    // Authorization check
    if (flat.createdBy.toString() !== userId) {
        throw new UnauthorizedError('You are not authorized to delete this listing');
    }

    // 1. Delete all associated images from Cloudinary
    if (flat.images && flat.images.length > 0) {
        await Promise.all(flat.images.map(url => deleteFile(url)));
    }

    // 2. Remove the flat reference from the user's document
    await User.findByIdAndUpdate(userId, { $pull: { 'Accomodations.Flat': flatId } });

    // 3. Delete the flat document from the database
    await flat.remove();

    res.status(StatusCodes.OK).json({ message: 'Flat listing deleted successfully' });
};

