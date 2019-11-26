const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const CommentController = require('../controllers/commentController');

//Create user
router.post('/', CommentController.create_comment);

router.get('/', CommentController.get_all_comment);

router.get('/:commentId', CommentController.get_comment);

router.patch('/:commentId', CommentController.update_comment);

router.delete('/:commentId', CommentController.delete_comment);

module.exports = router;
