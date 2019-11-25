const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const AchievementsController = require('../controllers/achievementsController');

//Create user
router.post('/', AchievementsController.create_achievement);

router.get('/', AchievementsController.get_all_achievement);

router.get('/:achievementId', AchievementsController.get_achievement);

router.patch('/:achievementId', AchievementsController.update_achievement);

router.delete('/:achievementId', AchievementsController.delete_achievement);

module.exports = router;