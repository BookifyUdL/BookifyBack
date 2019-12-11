const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const GenreController = require('../controllers/genreController');

//Create user
router.post('/', GenreController.create_genre);

router.get('/', GenreController.get_all_genres);

router.get('/:genreId', GenreController.get_genre);

router.patch('/update/:genreId', GenreController.update_genre_mobile);

router.patch('/:genreId', GenreController.update_genre);

router.delete('/:genreId', GenreController.delete_genre);

module.exports = router;
