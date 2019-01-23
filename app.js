var express     = require("express"),
    app         = express();
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    request     = require("request");

// set public directory for static files
app.use(express.static("public"));

// use bodyParser to parse incoming post requests
app.use(bodyParser.urlencoded({extended: true}));

// set view engine to use ejs templates
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var bands = [
    {name: "blink-182", img: "https://images.complex.com/complex/image/upload/c_scale,w_1920/fl_lossy,pg_1,q_auto/Blink182_AH5B4305_gbvh7y.jpg",wiki: "https://en.wikipedia.org/wiki/Blink-182"},
    {name: "Green Day", img: "https://www.billboard.com/files/styles/article_main_image/public/media/green-day-wbr-press-2016-cr-frank-maddocks-billboard-1548.jpg", wiki: "https://en.wikipedia.org/wiki/Green_Day"},
    {name: "Yellowcard", img: "http://www.janthord.com/webdevt/yellowcard/yellowcardabout.jpg", wiki: "https://en.wikipedia.org/wiki/Yellowcard"},
    {name: "Sum 41", img: "https://i.scdn.co/image/34a52aea7e7e3a194df14ce5ca5632d1c09e4dfe", wiki: "https://en.wikipedia.org/wiki/Sum_41"},
    {name: "Avenged Sevenfold", img: "https://images-na.ssl-images-amazon.com/images/G/01/music/artists/avenged_2.jpg", wiki: "https://en.wikipedia.org/wiki/Avenged_Sevenfold"},
    {name: "Mumford & Sons", img: "https://www.clashmusic.com/sites/default/files/styles/article_feature/public/field/image/James-Minchin_MumfordSons_4736_RET_AS_FL%20copy.jpg?itok=ZTgDcWGU", wiki: "https://en.wikipedia.org/wiki/Mumford_%26_Sons"},
    {name: "Red Hot Chili Peppers", img: "http://concreteplanet.com/wp-content/uploads/2013/08/271322_10150280648693919_2322840_o.jpg", wiki: "https://en.wikipedia.org/wiki/Red_Hot_Chili_Peppers"},
  ];

  res.render("homepage", {bands: bands});
});

app.get("/:band", function(req, res) {
  band = {name: req.params.band}

  res.render("band", {band: band});
});

app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
