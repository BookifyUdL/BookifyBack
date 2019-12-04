const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const UserController = require('../controllers/userController');

//Create user
router.post('/signup', UserController.user_signup);

router.post('/', UserController.user_signup);

router.get('/', UserController.get_all_users);

router.get('/', UserController.get_user);

router.patch('/:userId', UserController.update_user);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete);

module.exports = router;
