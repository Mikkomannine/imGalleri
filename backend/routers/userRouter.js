const express = require('express')
const requireAuth = require('../middleware/requireAuth')

const { loginUser, signupUser, followUser, unFollowUser, getFollowers, imageUpload, getMe, checkFollowStatus, getUser, updateUser, forgotPassword, resetPassword, getFollowing } = require('../controllers/userController')


const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.get('/myprofile', getMe)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

router.use(requireAuth);

router.get('/user/:id', getUser)

router.post("/follow/:id", followUser)

router.post("/unfollow/:id", unFollowUser)

router.get("/followers/:id", getFollowers)

router.get('/following/:id', getFollowing)

router.patch('/upload', upload.single('image'), imageUpload)

router.patch('/:id/edit', updateUser)

router.get('/isFollowing/:id', checkFollowStatus)


module.exports = router
