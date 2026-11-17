const express = require('express');
const router = express.Router();
const { getAllMedia, addMedia, getMedia, deleteMedia, updateMedia, getUsersMedia, addComment, getComments, deleteComment, likePost, unlikePost, checkLikeStatus, getMediaByFollowing } = require('../controllers/mediaController');
const requireAuth = require('../middleware/requireAuth');
const uploadImage = require('../middleware/uploadImage');
const validateObjectId = require('../middleware/validateObjectId');

router.param('id', validateObjectId);
router.param('mediaId', validateObjectId);
router.param('commentId', validateObjectId);

router.get('/', getAllMedia);

router.get('/:id', getMedia);

router.get('/user/:id', getUsersMedia);

router.get('/comments/:id', getComments);

router.use(requireAuth);

router.post('/like/:id', likePost);

router.post('/unlike/:id', unlikePost);

router.post('/addComment/:id', addComment);

router.delete('/delete/:mediaId/:commentId', deleteComment);

router.post('/', uploadImage('image'), addMedia);

router.delete('/delete/:mediaId', deleteMedia);

router.patch('/update/:id', updateMedia);

router.get('/isLiked/:id', checkLikeStatus);

router.get('/following/medias', getMediaByFollowing);


module.exports = router;
