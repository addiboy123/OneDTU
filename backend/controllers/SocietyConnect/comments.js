const Comment = require('../../models/SocietyConnect/comments');
const Post = require('../../models/SocietyConnect/posts');
const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError, NotFoundError } = require('../../errors');

// Add a comment to a post (authenticated users)
exports.addComment = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) throw new BadRequestError('Not authenticated');

  const postId = req.params.postId;
  const { comment } = req.body;
  if (!postId) throw new BadRequestError('postId is required');
  if (!comment || !comment.trim()) throw new BadRequestError('Comment text is required');

  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError('Post not found');

  const created = await Comment.create({ comment: comment.trim(), user: userId });

  post.comments = post.comments || [];
  post.comments.push(created._id);
  await post.save();

  const populated = await Comment.findById(created._id).populate('user', 'name profile_photo_url');
  res.status(201).json({ message: 'Comment added', comment: populated });
};

// Get paginated comments for a post (public)
exports.getComments = async (req, res) => {
  const postId = req.params.postId;
  if (!postId) throw new BadRequestError('postId is required');

  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));

  const post = await Post.findById(postId).select('comments');
  if (!post) throw new NotFoundError('Post not found');

  const total = (post.comments || []).length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  // Populate only the requested slice
  const populatedPost = await Post.findById(postId).populate({
    path: 'comments',
    options: { sort: { createdAt: -1 }, skip: start, limit },
    populate: { path: 'user', model: 'users', select: 'name profile_photo_url' }
  });

  const comments = populatedPost.comments || [];
  res.status(200).json({ message: 'Comments retrieved', count: comments.length, page, limit, total, totalPages, comments });
};

// Like a comment (authenticated users) — increments likes count
exports.likeComment = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) throw new BadRequestError('Not authenticated');

  const { commentId } = req.params;
  if (!commentId) throw new BadRequestError('commentId is required');

  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundError('Comment not found');

  comment.likes = (comment.likes || 0) + 1;
  await comment.save();
  res.status(200).json({ message: 'Comment liked', likes: comment.likes });
};

// Unlike a comment (authenticated users) — decrements likes count but not below 0
exports.unlikeComment = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) throw new BadRequestError('Not authenticated');

  const { commentId } = req.params;
  if (!commentId) throw new BadRequestError('commentId is required');

  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundError('Comment not found');

  comment.likes = Math.max(0, (comment.likes || 0) - 1);
  await comment.save();
  res.status(200).json({ message: 'Comment unliked', likes: comment.likes });
};

// Delete a comment: owner or society admin of the society containing the post
exports.deleteComment = async (req, res) => {
  const userId = req.user && req.user.userId;
  const commentId = req.params.commentId;
  if (!commentId) throw new BadRequestError('commentId is required');

  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundError('Comment not found');

  // find the post containing this comment
  const post = await Post.findOne({ comments: commentId });
  if (!post) throw new NotFoundError('Post not found');

  // allow if owner
  if (userId && comment.user && comment.user.toString() === userId.toString()) {
    // proceed to delete
  } else if (req.societyAdmin && req.societyAdmin.society) {
    // check if societyAdmin belongs to society that contains the post
    const society = await Society.findOne({ posts: post._id });
    if (!society) throw new NotFoundError('Society not found');
    if (society._id.toString() !== req.societyAdmin.society.toString()) {
      throw new BadRequestError('Not authorized to delete this comment');
    }
  } else {
    throw new BadRequestError('Not authorized to delete this comment');
  }

  // remove comment reference from post
  post.comments = (post.comments || []).filter(id => id.toString() !== commentId.toString());
  await post.save();

  await Comment.deleteOne({ _id: commentId });
  res.status(200).json({ message: 'Comment deleted' });
};
