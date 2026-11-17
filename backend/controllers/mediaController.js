const mongoose = require('mongoose');
const Media = require('../models/mediaModel');
const User = require('../models/userModel');
const { uploadFileToS3, generateSignedUrl, deleteFileFromS3 } = require('../config/s3');
const { serverError } = require('../middleware/customMiddleware');

// Same limits as the frontend forms.
const TITLE_MAX = 50;
const DESCRIPTION_MAX = 500;
const COMMENT_MAX = 200;

const isOptionalText = (value, max) =>
  value === undefined || value === null || (typeof value === 'string' && value.length <= max);

const withImageUrl = async (media) => {
  const obj = media.toObject();
  if (obj.imageKey) {
    obj.imageUrl = await generateSignedUrl(obj.imageKey);
  }
  return obj;
};

const withImageUrls = (mediaList) => Promise.all(mediaList.map(withImageUrl));

const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(await withImageUrls(media));
  } catch (error) {
    serverError(res, error);
  }
};

const getUsersMedia = async (req, res) => {
  try {
    const media = await Media.find({ user_id: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(await withImageUrls(media));
  } catch (error) {
    serverError(res, error);
  }
};

const addMedia = async (req, res) => {
  const { title, description } = req.body;

  if (!isOptionalText(title, TITLE_MAX) || !isOptionalText(description, DESCRIPTION_MAX)) {
    return res.status(400).json({ error: `Title max ${TITLE_MAX} and description max ${DESCRIPTION_MAX} characters` });
  }

  try {
    const imageKey = await uploadFileToS3(req.file);
    const newMedia = await Media.create({ title, description, user_id: req.user._id, imageKey });
    res.status(201).json(newMedia);
  } catch (error) {
    serverError(res, error);
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.status(200).json(await withImageUrl(media));
  } catch (error) {
    serverError(res, error);
  }
};

const deleteMedia = async (req, res) => {
  const { mediaId } = req.params;
  try {
    const media = await Media.findOneAndDelete({ _id: mediaId, user_id: req.user._id });
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    await User.updateMany({ liked: media._id }, { $pull: { liked: media._id } });

    if (media.imageKey) {
      try {
        await deleteFileFromS3(media.imageKey);
      } catch (error) {
        // The post is already gone; an orphaned S3 object is not worth a 500.
        console.error('Failed to delete S3 object', media.imageKey, error);
      }
    }

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    serverError(res, error);
  }
};

// Only title and description are editable; owner, image, likes and comments
// cannot be changed through this endpoint.
const updateMedia = async (req, res) => {
  const { title, description } = req.body;

  if (!isOptionalText(title, TITLE_MAX) || !isOptionalText(description, DESCRIPTION_MAX)) {
    return res.status(400).json({ error: `Title max ${TITLE_MAX} and description max ${DESCRIPTION_MAX} characters` });
  }

  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;

  try {
    const media = await Media.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { $set: update },
      { new: true }
    );
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    serverError(res, error);
  }
};

const getMediaByFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('following');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.following.length) {
      return res.status(404).json({ error: 'No followed users' });
    }

    const followingIds = user.following.map(String);
    const media = await Media.find({ user_id: mongoose.trusted({ $in: followingIds }) }).sort({ createdAt: -1 });

    if (!media.length) {
      return res.status(404).json({ error: 'No media found from followed users' });
    }

    res.status(200).json(await withImageUrls(media));
  } catch (error) {
    serverError(res, error);
  }
};

const addComment = async (req, res) => {
  const { text } = req.body;

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  if (text.length > COMMENT_MAX) {
    return res.status(400).json({ message: `Comment max ${COMMENT_MAX} characters` });
  }

  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text, postedBy: req.user._id } } },
      { new: true }
    );
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.status(201).json({ message: 'Comment added successfully', media });
  } catch (error) {
    serverError(res, error);
  }
};

const getComments = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).select('comments');
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.status(200).json(media.comments);
  } catch (error) {
    serverError(res, error);
  }
};

const deleteComment = async (req, res) => {
  const { mediaId, commentId } = req.params;
  const userId = req.user._id.toString();

  try {
    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    const comment = media.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.postedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await media.save();

    res.status(200).json({ message: 'Comment deleted successfully', media });
  } catch (error) {
    serverError(res, error);
  }
};

const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const media = await Media.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { liked: postId } });

    res.status(200).json({ message: 'Post has been liked!', media });
  } catch (error) {
    serverError(res, error);
  }
};

const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const media = await Media.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { liked: postId } });

    res.status(200).json({ message: 'post unliked successfully', media });
  } catch (error) {
    serverError(res, error);
  }
};

const checkLikeStatus = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('liked');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isLiked = currentUser.liked.some((likedId) => likedId.toString() === req.params.id);
    res.json({ isLiked });
  } catch (error) {
    serverError(res, error);
  }
};

module.exports = {
  getAllMedia,
  getUsersMedia,
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
  addComment,
  getComments,
  deleteComment,
  likePost,
  unlikePost,
  checkLikeStatus,
  getMediaByFollowing,
};
