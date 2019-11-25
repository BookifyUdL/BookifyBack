const express = require('express');
const router = express.Router();

const AuthorController = require('../controllers/reviewController');
const ReviewController = require('../controllers/reviewController');


//Create user
router.post('/', AuthorController.create_review);

router.get('/', AuthorController.get_all_review);

router.get('/:reviewId', AuthorController.get_review);

router.patch('/:reviewId', AuthorController.update_review);

router.delete('/:reviewId', AuthorController.delete_review);

module.exports = router;
