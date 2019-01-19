var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.render("homepage");
});

app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
