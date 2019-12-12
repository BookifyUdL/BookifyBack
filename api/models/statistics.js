const mongoose = require('mongoose');

const StatisticsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: {
    type: Number
  },
  quantity: {
    type: Number
  },
  time: {
      type: String
  }
});

var StatisticsModel = mongoose.model('Statistics', StatisticsSchema);

module.exports = StatisticsModel;