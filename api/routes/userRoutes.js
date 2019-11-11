const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

//Create user
router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete);

module.exports = router;