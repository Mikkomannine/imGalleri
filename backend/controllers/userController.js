const mongoose = require('mongoose')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const validator = require('validator')
const { uploadFileToS3, generateSignedUrl, deleteFileFromS3 } = require('../config/s3')
const sendResetEmail = require('../config/sendResetEmail')
const { serverError } = require('../middleware/customMiddleware')

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://imgalleri.onrender.com'
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60

// Fields anyone logged in may see on another user's profile. Email, phone
// number, real name, likes and secrets stay private.
const PUBLIC_USER_FIELDS = 'username bio imageKey followers following'

// Fields a user may change on their own profile, with max lengths matching the frontend.
const EDITABLE_TEXT_FIELDS = { firstName: 50, lastName: 50, bio: 200 }

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '5h' })
}

const hashResetToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex')

const withImageUrl = async (user) => {
  const data = user.toJSON()
  if (data.imageKey) {
    data.imageUrl = await generateSignedUrl(data.imageKey)
  }
  return data
}

const loginUser = async (req, res) => {
  const {username, password} = req.body
  try {
    const user = await User.login(username, password)
    const token = createToken(user._id)
    res.status(200).json({username: user.username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const signupUser = async (req, res) => {
  const {username, email, password, firstName, lastName, phoneNumber} = req.body

  try {
    const user = await User.signup(username, email, password, firstName, lastName, phoneNumber)
    const token = createToken(user._id)
    res.status(200).json({username: user.username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const followUser = async (req, res) => {
  const targetId = req.params.id
  const currentUserId = req.user._id

  if (targetId === currentUserId.toString()) {
    return res.status(400).json({ message: "You cannot follow yourself" })
  }

  try {
    const target = await User.findByIdAndUpdate(targetId, { $addToSet: { followers: currentUserId } })
    if (!target) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetId } })

    res.status(200).json({ message: "User has been followed" })
  } catch (error) {
    serverError(res, error)
  }
}

const unFollowUser = async (req, res) => {
  const targetId = req.params.id
  const currentUserId = req.user._id

  try {
    const target = await User.findOneAndUpdate(
      { _id: targetId, followers: currentUserId },
      { $pull: { followers: currentUserId } }
    )
    if (!target) {
      const exists = await User.exists({ _id: targetId })
      return exists
        ? res.status(403).json("You do not follow this user")
        : res.status(404).json({ message: 'User not found' })
    }

    await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetId } })

    res.status(200).json("User has been unfollowed")
  } catch (error) {
    serverError(res, error)
  }
}

const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('followers').populate('followers', 'username')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user.followers)
  } catch (error) {
    serverError(res, error)
  }
}

const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('following').populate('following', 'username')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user.following)
  } catch (error) {
    serverError(res, error)
  }
}

const checkFollowStatus = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('following')
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isFollowing = currentUser.following.some(followingId => followingId.toString() === req.params.id)

    res.json({ isFollowing })
  } catch (error) {
    serverError(res, error)
  }
}

const imageUpload = async (req, res) => {
  try {
    const oldImageKey = req.user.imageKey

    // Upload first and delete the old image last, so a failed upload does not
    // leave the user without a profile picture.
    const fileKey = await uploadFileToS3(req.file)

    const user = await User.findByIdAndUpdate(req.user._id, { imageKey: fileKey }, { new: true })
    if (!user) {
      return res.status(404).json({ error: 'User not found or update failed' })
    }

    if (oldImageKey) {
      try {
        await deleteFileFromS3(oldImageKey)
      } catch (error) {
        console.error('Failed to delete old profile image', oldImageKey, error)
      }
    }

    res.status(200).json({ message: 'Image uploaded successfully', imageKey: fileKey })
  } catch (error) {
    serverError(res, error)
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ user: await withImageUrl(user) })
  } catch (error) {
    serverError(res, error)
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(PUBLIC_USER_FIELDS)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(await withImageUrl(user))
  } catch (error) {
    serverError(res, error)
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params

  if (id !== req.user._id.toString()) {
    return res.status(403).json({ error: 'You can only edit your own profile' })
  }

  const update = {}

  for (const [field, max] of Object.entries(EDITABLE_TEXT_FIELDS)) {
    const value = req.body[field]
    if (value === undefined) continue
    if (value !== null && (typeof value !== 'string' || value.length > max)) {
      return res.status(400).json({ error: `${field} must be text of at most ${max} characters` })
    }
    update[field] = value
  }

  if (req.body.phoneNumber !== undefined) {
    const phone = req.body.phoneNumber
    if (phone === null || phone === '') {
      update.phoneNumber = null
    } else if (/^\d{1,15}$/.test(String(phone))) {
      update.phoneNumber = Number(phone)
    } else {
      return res.status(400).json({ error: 'Phone number must contain only digits' })
    }
  }

  if (req.body.email !== undefined) {
    const { email } = req.body
    if (typeof email !== 'string' || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email not valid' })
    }
    update.email = email
  }

  try {
    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' })
    }
    serverError(res, error)
  }
}

const forgotPassword = async (req, res) => {
  // Same response whether or not the account exists, so the endpoint cannot be
  // used to discover registered email addresses.
  const genericResponse = { message: "If an account with that email exists, a password reset link has been sent." }
  const { email } = req.body

  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email not valid' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(200).json(genericResponse)
    }

    // Only a hash of the token is stored, so a database leak does not expose
    // usable reset links.
    const token = crypto.randomBytes(32).toString("hex")
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken: hashResetToken(token), resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS) } }
    )

    const resetLink = `${FRONTEND_URL}/#/reset-password/${token}`

    try {
      await sendResetEmail(user.email, resetLink)
    } catch (error) {
      console.error('Failed to send password reset email:', error)
    }

    res.status(200).json(genericResponse)
  } catch (error) {
    serverError(res, error)
  }
}

const resetPassword = async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body

  if (typeof newPassword !== 'string' || !validator.isStrongPassword(newPassword)) {
    return res.status(400).json({ error: "Password not strong enough" })
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10)

    // Find, update and invalidate the token in one atomic step, so a token can
    // only be used once.
    const user = await User.findOneAndUpdate(
      { resetToken: hashResetToken(token), resetTokenExpiry: mongoose.trusted({ $gt: new Date() }) },
      { $set: { password: hashed }, $unset: { resetToken: 1, resetTokenExpiry: 1 } }
    )

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" })
    }

    res.status(200).json({ message: "Password reset successful" })
  } catch (error) {
    serverError(res, error)
  }
}

module.exports = { signupUser, loginUser, followUser, unFollowUser, getFollowers, imageUpload, getMe, checkFollowStatus, getUser, updateUser, forgotPassword, resetPassword, getFollowing }
