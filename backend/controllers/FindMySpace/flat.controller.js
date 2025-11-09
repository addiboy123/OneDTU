const FlatPost = require('../../models/FindMySpace/FlatPosts'); // Ensure correct model path
const User = require('../../models/User'); // Import the User model
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../../errors');
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
 * @desc    Get flats created by the currently authenticated user
 * @route   GET /api/v1/findmyspace/my/flats
 * @access  Private
 */
exports.getMyFlats = async (req, res) => {
    const { userId } = req.user;
    const flats = await FlatPost.find({ createdBy: userId }).sort('-createdAt');
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
    const { userId } = req.user;
    const { title, description, address, pricePerPerson, distanceFromDtu } = req.body;

    // 1. Validate required text fields
    if (!title || !description || !address || !pricePerPerson || !distanceFromDtu) {
        throw new BadRequestError('Title, description, address, pricePerPerson, and distanceFromDtu are required fields.');
    }

    // 2. Handle image uploads to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadImage(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);
        // **FIXED**: Correctly map over the results array to get each URL
        imageUrls = uploadResults.map(result => result.secure_url || result.url);
    } else {
        throw new BadRequestError('At least one image is required');
    }

    // 3. Create a clean data object for the new flat
    const flatData = {
        ...req.body,
        images: imageUrls,
        createdBy: userId,
    };

    const flat = await FlatPost.create(flatData);

    // 4. Add the new flat's ID to the user's document
    await User.findByIdAndUpdate(
        userId,
        { $push: { 'Accomodations.Flat': flat._id } }
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
        throw new UnauthenticatedError('You are not authorized to update this listing');
    }

    // Update text fields explicitly
    Object.assign(flat, req.body);
    
    // 1. Handle deletion of existing images
    let { deletedImages } = req.body;
    if (deletedImages) {
        // Robustly parse if it's a JSON string
        if (typeof deletedImages === 'string') {
            try { deletedImages = JSON.parse(deletedImages); } catch (e) { /* ignore parse error */ }
        }
        const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
        if (imagesToDelete.length > 0) {
            await Promise.all(imagesToDelete.map(url => deleteFile(url)));
            flat.images = flat.images.filter(imgUrl => !imagesToDelete.includes(imgUrl));
        }
    }

    // 2. Handle upload of new images
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadImage(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);
        const newImageUrls = uploadResults.map(result => result.secure_url || result.url);
        flat.images.push(...newImageUrls); // Use push with spread operator for efficiency
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
        throw new UnauthenticatedError('You are not authorized to delete this listing');
    }

    // 1. Delete all associated images from Cloudinary
    if (flat.images && flat.images.length > 0) {
        await Promise.all(flat.images.map(url => deleteFile(url)));
    }

    // 2. Remove the flat reference from the user's document
    await User.findByIdAndUpdate(userId, { $pull: { 'Accomodations.Flat': flatId } });

    // 3. **FIXED**: Use findByIdAndDelete instead of the deprecated .remove()
    await FlatPost.findByIdAndDelete(flatId);

    res.status(StatusCodes.OK).json({ message: 'Flat listing deleted successfully' });
};

