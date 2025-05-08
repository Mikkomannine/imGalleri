const mongoose = require('mongoose');
const Media = require('../models/mediaModel');
const s3Upload = require('../config/s3Upload');
const generateSignedUrl = require('../config/generateSignedUrl');
const User = require('../models/userModel');


const getAllMedia = async (req, res) => {
  try {
    let media = await Media.find().sort({createdAt: -1})

        for (let i = 0; i < media.length; i++) {
          if (media[i].imageKey) {
            const imageUrl = await generateSignedUrl(media[i].imageKey);
            media[i] = media[i].toObject(); 
            media[i].imageUrl = imageUrl;
          }
        }
    res.status(200).json(media)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

const getUsersMedia = async (req, res) => {
  const user_id = req.params.id;

  try {
    const mediaArray = await Media.find({user_id}).sort({createdAt: -1});
    console.log("media", mediaArray);

    for (let media of mediaArray) {
      if (media.imageKey) {
        console.log(media.imageKey);
        const imageUrl = await generateSignedUrl(media.imageKey);
        media.imageUrl = imageUrl; 
      } else {
        console.log("no image key");
      }
    }

    res.status(200).json(mediaArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
const addMedia = async (req, res) => {
  const { title, description } = req.body;

  try {
    const uploadResult = await s3Upload(req.file);
    const fileKey = uploadResult.Key; 

    const newMedia = new Media({ title, description, user_id: req.user._id , imageKey: fileKey});
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get Media by ID
const getMedia = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such Media'});
  }

  try {
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
        if (media.imageKey) {
          const imageUrl = await generateSignedUrl(media.imageKey);
          media.imageUrl = imageUrl; 
        }
    res.status(200).json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Delete Media by ID
const deleteMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const media = await Media.findByIdAndDelete({ _id: id, user_id: user_id });
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Update Media by ID
const updateMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const media = await Media.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

const deleteAllMedia = async (req, res) => {
  try {
    await Media.deleteMany();
    res.status(200).json({ message: 'All Media deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}
const addComment = async (req, res) => {
  const { text } = req.body;
  const mediaId = req.params.id;
  const userId = req.user._id; // Assuming you have user info in req.user

  if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
      const media = await Media.findById(mediaId);
      if (!media) {
          return res.status(404).json({ message: 'Media not found' });
      }

      media.comments.push({ text, postedBy: userId });
      await media.save();

      res.status(201).json({ message: 'Comment added successfully', media });
  } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
  }
};

const getComments = async (req, res) => {
  const mediaId = req.params.id;

  try {
      const media = await Media.findById(mediaId);
      if (!media) {
          return res.status(404).json({ message: 'Media not found' });
      }

      res.status(200).json(media.comments);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
  }
}

// Delete comment controller
const deleteComment = async (req, res) => {
  const { mediaId, commentId } = req.params;
  const userId = req.user._id; // assuming authentication middleware adds this

  try {
    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Use findIndex to locate the comment reliably
    const commentIndex = media.comments.findIndex(
      (c) => c._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = media.comments[commentIndex];

    if (comment.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    console.log("commentIndex", commentIndex);
    console.log("comment", comment);

    // Remove comment using splice
    media.comments.splice(commentIndex, 1);
    await media.save();

    res.status(200).json({ message: 'Comment deleted successfully', media });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};


const likePost = async (req, res) => {
  try {
      // Assuming req.params.id and req.body.userId are validated to be non-null, non-undefined, and valid ObjectId strings
      const postId = req.params.id;
      const currentUserId = req.user._id;

      const media = await Media.findByIdAndUpdate(postId, {
          $addToSet: { likes: currentUserId }
      }, { new: true });

      const currentUser = await User.findByIdAndUpdate(currentUserId, {
          $addToSet: { liked: postId }
      }, { new: true });

      if (!media) {
          return res.status(404).json({ message: "Media not found" });
      }

      if (!currentUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Post has been liked!", media});
  } catch (err) {
      console.error(err); // More detailed error handling/logging can be implemented here
      res.status(500).json({ message: "An error occurred", error: err });
  }
};

const unlikePost = async (req, res) => {
  const mediaId = req.params.id;
  const userId = req.user._id;

  try {
      const media = await Media.findById(mediaId);
      if (!media) {
          return res.status(404).json({ message: 'Media not found' });
      }

      if (media.likes.includes(userId)) {
        await media.updateOne({ $pull: { likes: userId } });
      } else {
        return res.status(400).json({ message: 'Post not liked' });
      }

      const user = await User.findById(userId);

      if (user.liked.includes(mediaId)) {
        await user.updateOne({ $pull: { liked: mediaId } });
      } else {
        return res.status(400).json({ message: 'Post not liked by user' });
      }

      await media.save();
      await user.save();

      res.status(200).json( { message: "post unliked successfully", media });
  }
  catch (error) {
      res.status(500).json({ message: 'Error unliking post', error });
  }
}

const checkLikeStatus = async (req, res) => {
  try {
      const postId = req.params.id; // Corrected the way userId is extracted from req.params
      const currentUserId = req.user._id; // Assuming you have middleware to set req.user based on the auth token

      // Find the current user and check if the 'following' array contains the userId
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) { 
          return res.status(404).json({ message: 'User not found' });
      }

      const isLiked = currentUser.liked.some(likedId => likedId.toString() === postId);

      res.json({ isLiked }); // This will return true or false based on the condition
  } catch (error) {
      console.error('Failed to check follow status:', error);
      res.status(500).send('Server error');
  }
};

module.exports = {
  getAllMedia,
  getUsersMedia,
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
  deleteAllMedia,
  addComment,
  getComments,
  deleteComment,
  likePost,
  unlikePost,
  checkLikeStatus
};