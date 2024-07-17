const express = require('express');
const router = express.Router();
const { getAllMedia, addMedia, getMedia, deleteMedia, updateMedia, getUsersMedia, deleteAllMedia, addComment, getComments, deleteComment, likePost, unlikePost, checkLikeStatus } = require('../controllers/mediaController');
const requireAuth = require('../middleware/requireAuth')

const multer = require('multer');

// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// GET all Medias
router.get('/', getAllMedia);

// GET a single Media
router.get('/:id', getMedia);

// get User's Media
router.get('/user/:id', getUsersMedia);

router.delete('/deleteAll', deleteAllMedia)

router.get('/comments/:id', getComments);

// require auth
router.use(requireAuth);

router.post('/like/:id', likePost);

router.post('/unlike/:id', unlikePost);

router.post('/addComment/:id', addComment);

router.delete('/delete/:id/:commentId', deleteComment);

// POST a new Media
router.post('/', upload.single('image'), addMedia);

// DELETE a Media
router.delete('/:id', deleteMedia);

// Update Media using PUT
router.patch('/:id', updateMedia);

router.get('/isLiked/:id', checkLikeStatus);




//router.patch('/upload/:id', upload.single('image'), imageUpload)

module.exports = router;
