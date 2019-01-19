var express     = require("express"),
    app         = express();
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("homepage");
});

app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
