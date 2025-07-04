const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const s3Upload = require('../config/s3Upload')
const generateSignedUrl = require('../config/generateSignedUrl')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendResetEmail = require('../config/sendResetEmail')
const validator = require('validator')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '5h' })
}

const loginUser = async (req, res) => {
  const {username, password} = req.body
  try {
    const user = await User.login(username, password)
    const token = createToken(user._id)
    res.status(200).json({username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const signupUser = async (req, res) => {
  const {username, email, password, firstName, lastName, phoneNumber, imageUrl} = req.body

  try {
    const user = await User.signup(username, email, password, firstName, lastName, phoneNumber, imageUrl)
    const token = createToken(user._id)
    res.status(200).json({username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

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
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json(err);
    }
};

const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.followers);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json(err);
    }
};

const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.following);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json(err);
    }
}

const followUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id;

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
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ message: "An error occurred", error: err });
    }
};

const checkFollowStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) { 
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.some(followingId => followingId.toString() === userId);

        res.json({ isFollowing });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Token expired');
        }
        console.error('Failed to check follow status:', error);
        res.status(500).send('Server error');
    }
};


const imageUpload = async (req, res) => {
    try {
        const uploadResult = await s3Upload(req.file);
        const fileKey = uploadResult.Key;

        const user = await User.findByIdAndUpdate(req.user._id, { imageKey: fileKey }, { new: true });

        if (!user) {
            console.error('User not found or update failed');
            return res.status(404).send({ error: 'User not found or update failed' });
        }
        res.status(200).json({ message: 'Image uploaded successfully', imageKey: fileKey});
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token expired' });
        }
        console.error('Error uploading image to S3:', error);
        res.status(500).send({ error: 'Error uploading image' });
    }
};

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
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
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
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
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
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
  
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 60;
    await user.save();
  
    const resetLink = `https://imgalleri.onrender.com/#/reset-password/${token}`;

    await sendResetEmail(user.email, resetLink);
  
    res.status(200).json({ message: "Password reset link sent" });

  }  

  const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
  
    if (!user) {
      console.log("No user found or token expired.");
      return res.status(400).send("Invalid or expired token");
    }
  
    if (!validator.isStrongPassword(newPassword)) {
      console.log("Weak password:", newPassword);
      return res.status(400).send("Password not strong enough");
    }
  
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
  
    res.status(200).json({ message: "Password reset successfull" });

  };
  
  

module.exports = { signupUser, loginUser, followUser, unFollowUser, getFollowers, imageUpload, getMe, checkFollowStatus, getUser, updateUser, forgotPassword, resetPassword, getFollowing }
