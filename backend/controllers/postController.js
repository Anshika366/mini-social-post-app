const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    const posts = await Post.find()
      .populate('user', 'username email createdAt')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: {
        posts,
        page,
        limit,
        totalPages,
        totalPosts,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching posts'
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username email createdAt');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post fetched successfully',
      data: post
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching post'
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imagePath = '';

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    if (!text && !imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Post must contain either text content or an image'
      });
    }

    const newPost = await Post.create({
      user: req.user._id,
      text: text || '',
      image: imagePath,
      likes: [],
      comments: []
    });

    const populatedPost = await Post.findById(newPost._id).populate('user', 'username email createdAt');

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating post'
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own posts.'
      });
    }

    const { text, removeImage } = req.body;

    if (text !== undefined) {
      post.text = text;
    }

    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    } else if (removeImage === 'true') {
      post.image = '';
    }

    if (!post.text.trim() && !post.image) {
      return res.status(400).json({
        success: false,
        message: 'Post must contain either text or an image'
      });
    }

    await post.save();

    const populatedPost = await Post.findById(post._id).populate('user', 'username email createdAt');

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: populatedPost
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating post'
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete your own posts.'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting post'
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const username = req.user.username;
    const isLiked = post.likes.includes(username);

    if (isLiked) {
      post.likes = post.likes.filter((user) => user !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id).populate('user', 'username email createdAt');

    return res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked successfully' : 'Post liked successfully',
      data: populatedPost
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error toggling like'
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const newComment = {
      username: req.user.username,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(post._id).populate('user', 'username email createdAt');

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedPost
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error adding comment'
    });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment
};
