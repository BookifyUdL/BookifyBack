const express = require('express');
const router = express.Router();

// const checkAuth = require('../middleware/check-auth');

const ShopController = require('../controllers/shopController');

//Create user
router.post('/', ShopController.create_shop);

router.get('/', ShopController.get_all_shop);

router.get('/:shopId', ShopController.get_shop);

router.patch('/:shopId', ShopController.update_shop);

router.delete('/:shopId', ShopController.delete_shop);

module.exports = router;
