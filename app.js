var express     = require("express"),
    app         = express();
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var bands = [
    {name: "blink-182", img: "https://s.hdnux.com/photos/10/35/03/2216160/5/920x920.jpg",wiki: "https://en.wikipedia.org/wiki/Blink-182"},
    {name: "Green Day", img: "https://www.billboard.com/files/styles/article_main_image/public/media/green-day-wbr-press-2016-cr-frank-maddocks-billboard-1548.jpg", wiki: "https://en.wikipedia.org/wiki/Green_Day"},
    {name: "Yellowcard", img: "http://www.janthord.com/webdevt/yellowcard/yellowcardabout.jpg", wiki: "https://en.wikipedia.org/wiki/Yellowcard"}
  ];

  res.render("homepage", {bands: bands});
});

app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
