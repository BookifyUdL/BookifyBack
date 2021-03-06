const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  num_page: {
      type: Number,
      required: true
  },
  publication_date: { 
    type: Date,
    required: true
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true
  },
  genre: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Genre',
    required: true
  }],
  cover_image: {
    type: String,
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  rating: {
    type: Number,
    default:0
  },
  num_rating: {
    type: Number,
    default: 0
  },
  is_new: {
    type:Boolean,
    default:false
  },
  feelings: {
    type:Object,
    default: {"angry": 0,"scared": 0, "sad": 0, "confused": 0, "bored": 0, "shocked": 0, "happy": 0, "excited": 0}
  }
});

var BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;