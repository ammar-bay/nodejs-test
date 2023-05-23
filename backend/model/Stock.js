const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  variant: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Stock", stockSchema);
