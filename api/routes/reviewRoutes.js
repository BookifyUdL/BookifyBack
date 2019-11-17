const express = require('express');
const router = express.Router();

const ReviewController = require('../controllers/reviewController');

//Create user
router.post('/', ReviewController.create_review);

router.get('/', ReviewController.get_all_review);

router.get('/:reviewId', ReviewController.get_review);

router.patch('/:reviewId', ReviewController.update_review);

router.delete('/:reviewId', ReviewController.delete_review);

module.exports = router;