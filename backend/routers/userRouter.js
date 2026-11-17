const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const uploadImage = require('../middleware/uploadImage')
const validateObjectId = require('../middleware/validateObjectId')
const { authLimiter, passwordResetEmailLimiter } = require('../middleware/rateLimit')

const { loginUser, signupUser, followUser, unFollowUser, getFollowers, imageUpload, getMe, checkFollowStatus, getUser, updateUser, forgotPassword, resetPassword, getFollowing } = require('../controllers/userController')

const router = express.Router()

router.param('id', validateObjectId)

router.post('/login', authLimiter, loginUser)

router.post('/signup', authLimiter, signupUser)

router.post("/forgot-password", passwordResetEmailLimiter, forgotPassword)

router.post("/reset-password/:token", authLimiter, resetPassword)

router.use(requireAuth);

router.get('/myprofile', getMe)

router.get('/user/:id', getUser)

router.post("/follow/:id", followUser)

router.post("/unfollow/:id", unFollowUser)

router.get("/followers/:id", getFollowers)

router.get('/following/:id', getFollowing)

router.patch('/upload', uploadImage('image'), imageUpload)

router.patch('/:id/edit', updateUser)

router.get('/isFollowing/:id', checkFollowStatus)


module.exports = router
