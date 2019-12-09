const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/adminController');

//Create user
router.post('/auth', AdminController.authenticate);
router.post('/init', AdminController.init);

module.exports = router;
