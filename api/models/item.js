const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
  },
  book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
  },
  price: {
    type: String,
    required: true,
  }

});

var ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;
