const mongoose = require('mongoose');

const GenreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  books: {
    type: [Books],
    required: true
  }
});

var GenreModel = mongoose.model('User', GenreSchema);

module.exports = GenreModel;