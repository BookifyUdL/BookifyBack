const mongoose = require('mongoose');

const ShopSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: false
  }
});

var ShopModel = mongoose.model('Shop', ShopSchema);

module.exports = ShopModel;
