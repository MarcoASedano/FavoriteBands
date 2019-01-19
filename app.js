var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send("Your app is up! This will be the landing page");
});

app.listen(3000, function() {
  console.log("The YelpCamp server has started!");
});
