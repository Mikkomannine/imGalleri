const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const s3Upload = require('../config/s3Upload')
const generateSignedUrl = require('../config/generateSignedUrl')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password, firstName, lastName, role, phoneNumber, imageUrl} = req.body

  try {
    const user = await User.signup(email, password, firstName, lastName, role, phoneNumber, imageUrl)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// Unfollow a user
const unFollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (user.followers.includes(req.user._id)) {
            await user.updateOne({ $pull: { followers: req.user._id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json("User has been unfollowed");
        
        } else {
            res.status(403).json("You do not follow this user");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'email'); // Populate followers field with username
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.followers);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Follow a user
const followUser = async (req, res) => {
    try {
        // Assuming req.params.id and req.body.userId are validated to be non-null, non-undefined, and valid ObjectId strings
        const userId = req.params.id;
        const currentUserId = req.user._id;

      

        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userUpdateResult = await User.findByIdAndUpdate(userId, {
            $addToSet: { followers: currentUserId }
        }, { new: true });

        const currentUserUpdateResult = await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { following: userId }
        }, { new: true });

        if (!userUpdateResult || !currentUserUpdateResult) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User has been followed" });
    } catch (err) {
        console.error(err); // More detailed error handling/logging can be implemented here
        res.status(500).json({ message: "An error occurred", error: err });
    }
};

const checkFollowStatus = async (req, res) => {
    try {
        const userId = req.params.id; // Corrected the way userId is extracted from req.params
        const currentUserId = req.user._id; // Assuming you have middleware to set req.user based on the auth token

        // Find the current user and check if the 'following' array contains the userId
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) { 
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.some(followingId => followingId.toString() === userId);

        res.json({ isFollowing }); // This will return true or false based on the condition
    } catch (error) {
        console.error('Failed to check follow status:', error);
        res.status(500).send('Server error');
    }
};


// upload image
const imageUpload = async (req, res) => {
    try {
        const uploadResult = await s3Upload(req.file);
        const fileKey = uploadResult.Key;

        const user = await User.findByIdAndUpdate(req.params.id, { imageKey: fileKey }, { new: true });

        if (!user) {
            console.error('User not found or update failed');
            return res.status(404).send({ error: 'User not found or update failed' });
        }
        res.status(200).json({ message: 'Image uploaded successfully', imageKey: fileKey});
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        res.status(500).send({ error: 'Error uploading image' });
    }
};


// get my user profile
const getMe = async (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization.split(' ')[1];
    try {
        const { _id } = jwt.verify(token, process.env.SECRET);

        const user = await User.findOne({ _id }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.imageKey) {
            const imageUrl = await generateSignedUrl(user.imageKey);
            user._doc.imageUrl = imageUrl;
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.imageKey) {
            const imageUrl = await generateSignedUrl(user.imageKey);
            user._doc.imageUrl = imageUrl;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}


module.exports = { signupUser, loginUser, followUser, unFollowUser, getFollowers, imageUpload, getMe, checkFollowStatus, getUser, updateUser}
