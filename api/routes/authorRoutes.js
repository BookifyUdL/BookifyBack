const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const AuthorController = require('../controllers/authorController');

//Create user
router.post('/', AuthorController.create_author);

router.get('/', AuthorController.get_all_author);

router.get('/:authorId', AuthorController.get_author);

router.patch('/:authorId', AuthorController.update_author);

router.delete('/:authorId', AuthorController.delete_author);

module.exports = router;
