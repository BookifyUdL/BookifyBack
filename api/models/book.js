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
  num_pages: {
      type: Number,
      required: true
  },
  publication_date: { 
    type: Date,
    required: true
  },
  genre: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Genre',
    required: true
  },
  cover_image: {
    type: String,
    required: true
  }
});

var BookModel = mongoose.model('User', BookSchema);

module.exports = BookModel;