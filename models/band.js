var mongoose = require("mongoose");

// Band Schema Setup
var bandSchema = new mongoose.Schema({
  name: String,
  img: String,
  wiki: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Band", bandSchema);
