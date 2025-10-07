const Post = require('../../models/SocietyConnect/posts');
const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError, NotFoundError } = require('../../errors');
const { uploadImage, deleteFile } = require('../../util/cloud');

// Create a post in a society (only society admin for that society)
exports.createPost = async (req, res) => {
  const societyId = req.societyAdmin && req.societyAdmin.society;
  if (!societyId) throw new BadRequestError('Not authorized');

  const { title, description, postCategory } = req.body;
  if (!title || !description || !postCategory) {
    throw new BadRequestError('title, description and postCategory are required');
  }

  const society = await Society.findById(societyId);
  if (!society) throw new NotFoundError('Society not found');

  // upload images if provided
  let images = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(f => uploadImage(f.buffer));
    const results = await Promise.all(uploadPromises);
    images = results.map(r => r.secure_url || r.url);
  }

  const post = await Post.create({ title, description, images, postCategory });

  // push to society posts
  society.posts = society.posts || [];
  society.posts.push(post._id);
  await society.save();

  res.status(201).json({ message: 'Post created', post });
};

// Update a post (only society admin of the society that contains the post)
exports.updatePost = async (req, res) => {
  const societyId = req.societyAdmin && req.societyAdmin.society;
  if (!societyId) throw new BadRequestError('Not authorized');

  const { postId, title, description, postCategory } = req.body;
  if (!postId) throw new BadRequestError('postId is required');

  const society = await Society.findById(societyId);
  if (!society) throw new NotFoundError('Society not found');

  if (!society.posts || !society.posts.some(id => id.toString() === postId)) {
    throw new BadRequestError('Not authorized to update this post');
  }

  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError('Post not found');

  if (title !== undefined) post.title = title;
  if (description !== undefined) post.description = description;
  if (postCategory !== undefined) post.postCategory = postCategory;

  // handle deletedImages from form-data or json
  let deletedImages = req.body.deletedImages;
  if (deletedImages && typeof deletedImages === 'string') {
    try { deletedImages = JSON.parse(deletedImages); } catch (e) { /* keep string */ }
  }
  if (deletedImages) {
    const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
    await Promise.all(imagesToDelete.map(url => deleteFile(url)));
    post.images = (post.images || []).filter(img => !imagesToDelete.includes(img));
  }

  // upload new images if provided
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(f => uploadImage(f.buffer));
    const results = await Promise.all(uploadPromises);
    const uploaded = results.map(r => r.secure_url || r.url);
    post.images = [...(post.images || []), ...uploaded];
  }

  await post.save();
  res.status(200).json({ message: 'Post updated', post });
};

// Delete a post (only society admin of the society that contains the post)
exports.deletePost = async (req, res) => {
  const societyId = req.societyAdmin && req.societyAdmin.society;
  if (!societyId) throw new BadRequestError('Not authorized');

  const { postId } = req.body;
  if (!postId) throw new BadRequestError('postId is required');

  const society = await Society.findById(societyId);
  if (!society) throw new NotFoundError('Society not found');

  if (!society.posts || !society.posts.some(id => id.toString() === postId)) {
    throw new BadRequestError('Not authorized to delete this post');
  }

  const post = await Post.findById(postId);
  if (!post) {
    // remove reference if post missing
    society.posts = society.posts.filter(id => id.toString() !== postId);
    await society.save();
    return res.status(200).json({ message: 'Post reference removed (post not found)' });
  }

  // delete images from cloud
  if (post.images && post.images.length > 0) {
    await Promise.all(post.images.map(url => deleteFile(url)));
  }

  await Post.deleteOne({ _id: postId });
  society.posts = society.posts.filter(id => id.toString() !== postId);
  await society.save();

  res.status(200).json({ message: 'Post deleted' });
};

// Public: get all posts across all societies
exports.getAllPosts = async (req, res) => {
  // Pagination params
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));

  // gather posts across societies
  const societies = await Society.find().populate({ path: 'posts', model: 'Post' });
  let posts = [];
  societies.forEach(soc => {
    (soc.posts || []).forEach(p => {
      posts.push({ ...p.toObject(), society: { id: soc._id, name: soc.name } });
    });
  });

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paginated = posts.slice(start, start + limit);

  res.status(200).json({ message: 'Posts retrieved', count: paginated.length, page, limit, total, totalPages, posts: paginated });
};

// Public: get posts for a particular society
exports.getPostsBySociety = async (req, res) => {
    const societyId = req.params.societyId;
    if (!societyId) throw new BadRequestError('Society id is required');

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));

    const society = await Society.findById(societyId).populate({ path: 'posts', model: 'Post' });
    if (!society) throw new NotFoundError('Society not found');

    const allPosts = society.posts || [];
    const total = allPosts.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginated = allPosts.slice(start, start + limit);

    res.status(200).json({ message: 'Posts retrieved', count: paginated.length, page, limit, total, totalPages, posts: paginated });
};

// Public: get a particular post with its comments and likes
exports.getPostById = async (req, res) => {
    const postId = req.params.postId;
    if (!postId) throw new BadRequestError('postId is required');

    const post = await Post.findById(postId).populate({ path: 'comments', model: 'Comment' });
    if (!post) throw new NotFoundError('Post not found');

    res.status(200).json({ message: 'Post retrieved', post });
};

// Authenticated: like a post (increments likes)
exports.likePost = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) throw new BadRequestError('Not authenticated');

  const postId = req.params.postId;
  if (!postId) throw new BadRequestError('postId is required');

  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError('Post not found');

  post.likes = (post.likes || 0) + 1;
  await post.save();
  res.status(200).json({ message: 'Post liked', likes: post.likes, post });
};

// Authenticated: unlike a post (decrements likes, not below 0)
exports.unlikePost = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) throw new BadRequestError('Not authenticated');

  const postId = req.params.postId;
  if (!postId) throw new BadRequestError('postId is required');

  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError('Post not found');

  post.likes = Math.max(0, (post.likes || 0) - 1);
  await post.save();
  res.status(200).json({ message: 'Post unliked', likes: post.likes, post });
};
