const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const StatisticsController = require('../controllers/statisticsController');

router.patch('/:statisticsId', StatisticsController.update_statistics_increment);

router.get('/:statisticsId', StatisticsController.get_statistics_by_id);

router.get('/type/:type', StatisticsController.get_statistics_by_type);

router.delete('/:statisticsId', StatisticsController.delete_statistics);

router.get('/', StatisticsController.get_all_statistics);

router.post('/', StatisticsController.create_statistics);

router.post('/init', StatisticsController.init_statistics);

module.exports = router;
