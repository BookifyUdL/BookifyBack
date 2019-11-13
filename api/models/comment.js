const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  message: {
    type: String,
    required: true,
    unique: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user_liked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  uri: {
    type:String
  },
  comment_type: {
    type: Number,
    required: true
  },
  subreviews: {
    type:[mongoose.Schema.Types.ObjectId],
    ref: 'Review'
  }
});

var CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;