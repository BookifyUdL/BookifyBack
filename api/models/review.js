const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  stars: {
    type: Number,
    required: true
  },
  sentiment: {
    type: String,
    required: true
  }

});

var ReviewModel = mongoose.model('Achievement', ReviewSchema);

module.exports = ReviewModel;