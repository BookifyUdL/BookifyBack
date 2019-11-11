const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  message: {
    type: String,
    required: true,
    unique: true
  },
  book: {
    type: Book,
    required: true
  }
});

var CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;