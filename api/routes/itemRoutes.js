const express = require('express');
const router = express.Router();

const ItemController = require('../controllers/itemController');

//Create user
router.post('/', ItemController.create_item);

router.get('/', ItemController.get_all_item);

router.get('/:itemId', ItemController.get_item);

router.patch('/:itemId', ItemController.update_item);

router.delete('/:itemId', ItemController.delete_item);

module.exports = router;
