const PGPost = require('../../models/FindMySpace/PGPost'); // Adjust path as needed
const PG = require('../../models/FindMySpace/PG'); // Import parent PG model
const User = require('../../models/User'); // Import User model
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../../errors');
const { uploadImage, deleteFile } = require('../../util/cloud'); // Import cloud utility functions

/**
 * @desc    Get all PG posts (rooms)
 * @route   GET /api/v1/PGposts
 * @access  Public
 */
exports.getAllPosts = async (req, res) => {
    const posts = await PGPost.find({}).sort('-createdAt');
    res.status(StatusCodes.OK).json({ count: posts.length, posts });
};

/**
 * @desc    Get a single PG post by its ID
 * @route   GET /api/v1/PGposts/:postId
 * @access  Public
 */
exports.getPostById = async (req, res) => {
    const { postId } = req.params;
    const post = await PGPost.findById(postId);

    if (!post) {
        throw new NotFoundError(`No post found with id: ${postId}`);
    }

    res.status(StatusCodes.OK).json({ post });
};

/**
 * @desc    Create a new PG post (a room) with an image upload
 * @route   POST /api/v1/PGposts
 * @access  Private
 */
exports.createPost = async (req, res) => {
    const { userId } = req.user;
    const { pgId, roommates_required, title, description } = req.body;

    // **FIXED**: Added validation for all required fields from the schema
    if (!pgId || !roommates_required || !title || !description) {
        throw new BadRequestError('pgId, title, description, and roommates_required are all required fields.');
    }

    const parentPG = await PG.findById(pgId);
    if (!parentPG) {
        throw new NotFoundError(`Parent PG with id ${pgId} not found`);
    }

    let roomImageUrl;
    // Handle single image upload for 'roomImage'
    if (req.files && req.files.length > 0) {
        const file = req.files[0];
        const uploadResult = await uploadImage(file.buffer);
        roomImageUrl = uploadResult.secure_url || uploadResult.url;
    } else {
        throw new BadRequestError('A room image is required.');
    }

    // Create a new object with only the required fields to prevent unwanted data injection
    const postData = {
        title,
        description,
        roommates_required,
        roomImage: roomImageUrl,
        createdBy: userId,
        parentPG: pgId
    };

    const post = await PGPost.create(postData);

    // Update references in parent PG and User documents
    await PG.findByIdAndUpdate(pgId, { $push: { posts: post._id } });
    await User.findByIdAndUpdate(userId, { $push: { 'Accomodations.PG': post._id } });

    res.status(StatusCodes.CREATED).json({ message: 'PG post created successfully', post });
};

/**
 * @desc    Update a PG post, including its image
 * @route   PUT /api/v1/PGposts/:postId
 * @access  Private (Creator only)
 */
exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { title, description, roommates_required } = req.body;

    const post = await PGPost.findById(postId);
    if (!post) {
        throw new NotFoundError(`No post found with id: ${postId}`);
    }

    // Authorization check
    if (post.createdBy.toString() !== userId) {
        throw new UnauthenticatedError('You are not authorized to update this post');
    }

    // **FIXED**: Explicitly update fields to ensure required fields aren't set to empty
    if (title) post.title = title;
    if (description) post.description = description;
    if (roommates_required) post.roommates_required = roommates_required;

    // Check for and handle a new image upload
    if (req.files && req.files.length > 0) {
        if (post.roomImage) {
            await deleteFile(post.roomImage);
        }
        const file = req.files[0];
        const uploadResult = await uploadImage(file.buffer);
        post.roomImage = uploadResult.secure_url || uploadResult.url;
    }

    await post.save();

    res.status(StatusCodes.OK).json({ message: 'Post updated successfully', post });
};

/**
 * @desc    Delete a PG post and its image
 * @route   DELETE /api/v1/PGposts/:postId
 * @access  Private (Creator only)
 */
exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const post = await PGPost.findById(postId);
    if (!post) {
        throw new NotFoundError(`No post found with id: ${postId}`);
    }

    // Authorization check
    if (post.createdBy.toString() !== userId) {
        throw new UnauthenticatedError('You are not authorized to delete this post');
    }

    if (post.roomImage) {
        await deleteFile(post.roomImage);
    }

    await PG.findByIdAndUpdate(post.parentPG, { $pull: { posts: postId } });
    await User.findByIdAndUpdate(userId, { $pull: { 'Accomodations.PG': postId } });

    // **FIXED**: Use findByIdAndDelete instead of the deprecated .remove()
    await PGPost.findByIdAndDelete(postId);

    res.status(StatusCodes.OK).json({ message: 'Post deleted successfully' });
};

