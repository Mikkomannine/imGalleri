const express = require('express')
const requireAuth = require('../middleware/requireAuth')

// controller functions
const { loginUser, signupUser, followUser, unFollowUser, getFollowers, imageUpload, getMe, checkFollowStatus, getUser, updateUser, forgotPassword, resetPassword } = require('../controllers/userController')
const currentTokenAuth = require('../middleware/currentTokenAuth')


const multer = require('multer');

// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.get('/user/:id', requireAuth, getUser)

router.post("/follow/:id", requireAuth, followUser)

router.post("/unfollow/:id", requireAuth, unFollowUser)

router.get("/followers/:id", requireAuth, getFollowers)

router.patch('/upload/:id', upload.single('image'), requireAuth, currentTokenAuth, imageUpload)

router.patch('/:id/edit', requireAuth, updateUser)

router.get('/myprofile', getMe)

router.get('/isFollowing/:id', requireAuth, checkFollowStatus)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

module.exports = router
