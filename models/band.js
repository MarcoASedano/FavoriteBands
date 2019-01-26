var mongoose = require("mongoose");

// Band Schema Setup
var bandSchema = new mongoose.Schema({
  name: String,
  img: String,
  wiki: String
});

module.exports = mongoose.model("Band", bandSchema);
