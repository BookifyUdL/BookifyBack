const mongoose = require('mongoose');

const AchievementSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  }

});

var AchievementModel = mongoose.model('Achievement', AchievementSchema);

module.exports = AchievementModel;