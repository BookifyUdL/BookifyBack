const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const BookController = require('../controllers/bookController');

//Create user
router.post('/', BookController.create_book);

router.get('/', BookController.get_all_books);

router.get('/:bookId', BookController.get_book_by_Id);

router.get('/title/:bookTitle', BookController.get_book_by_title);

router.get('/genre/:bookGenre', BookController.get_book_by_genre);

router.get('/new/:bookIsNew', BookController.get_book_by_newness);

router.patch('/:bookId', BookController.update_book);

router.delete('/:bookId', BookController.delete_book);

module.exports = router;
