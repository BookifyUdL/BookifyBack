const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const BookController = require('../controllers/bookController');

//Create user
router.post('/', BookController.create_book);

router.get('/author/:authorId', BookController.get_book_by_author);

router.get('/title/:bookTitle', BookController.get_book_by_title);

router.get('/genre/:bookGenre', BookController.get_book_by_genre);

router.get('/new/:bookIsNew', BookController.get_book_by_newness);

router.get('/genres/:genreId', BookController.get_genre_top_books);

router.get('/:bookId/comments', BookController.get_book_comments);

router.get('/:bookId/rate', BookController.get_book_rate);

router.get('/toprated', BookController.get_toprated_books);

router.get('/:bookId', BookController.get_book_by_Id);

router.get('/', BookController.get_all_books);

router.patch('/:bookId', BookController.update_book);

router.delete('/:bookId', BookController.delete_book);

module.exports = router;
