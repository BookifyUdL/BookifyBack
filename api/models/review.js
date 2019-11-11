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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //required:true
  }

});

var ReviewModel = mongoose.model('Review', ReviewSchema);

module.exports = ReviewModel;