const express = require('express');
const router = express.Router();

const AuthorController = require('../controllers/reviewController');
const ReviewController = require('../controllers/reviewController');

//Create user
router.post('/', ReviewController.create_review);

router.get('/', ReviewController.get_all_review);

router.get('/:reviewId', ReviewController.get_review);

router.patch('/update/:reviewId', ReviewController.update_review_mobile);

router.patch('/:reviewId', ReviewController.update_review);

router.delete('/:reviewId', ReviewController.delete_review);

module.exports = router;
