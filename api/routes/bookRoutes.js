const express = require('express');
const router = express.Router();

const BookController = require('../controllers/bookController');

//Create user
router.post('/', BookController.create_book);

router.get('/', BookController.get_all_books);

router.get('/:bookTitle', BookController.get_book_by_title);

router.get('/:bookGenre', BookController.get_book_by_genre);

router.patch('/:bookId', BookController.update_book);

router.delete('/:bookId', BookController.delete_book);

module.exports = router;
