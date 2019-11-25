const mongoose = require('mongoose');

const ShopSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  }

});

var ShopModel = mongoose.model('Shop', ShopSchema);

module.exports = ShopModel;