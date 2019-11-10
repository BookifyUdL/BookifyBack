const mongoose = require('mongoose');

const GenreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  books: {
    type: [Book],
    required: true
  }
});

var GenreModel = mongoose.model('Genre', GenreSchema);

module.exports = GenreModel;