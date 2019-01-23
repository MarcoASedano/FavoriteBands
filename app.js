var express     = require("express"),
    app         = express();
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    request     = require("request");

//connect to mongoose server
mongoose.connect("mongodb://localhost/favoritebands", {useNewUrlParser: true});

// set public directory for static files
app.use(express.static("public"));

// use bodyParser to parse incoming post requests
app.use(bodyParser.urlencoded({extended: true}));

// set view engine to use ejs templates
app.set("view engine", "ejs");

// Schema Setup
var bandSchema = new mongoose.Schema({
  name: String,
  img: String,
  wiki: String
});

var Band = mongoose.model("Band", bandSchema);

app.get("/", function(req, res) {
  res.redirect("/bands");
});

// show all bands
app.get("/bands", function(req, res) {
  Band.find({}, function(err, allBands) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {bands: allBands});
    }
  })
});

// add new band object to database
app.post("/bands", function(req, res) {
  var name = req.body.name;
  var img = req.body.img;
  var wiki = req.body.wiki;
  var newBand = {name: name, img: img, wiki: wiki};

  Band.create(newBand, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bands/" + name);
    }
  });
});

// get more information about one band
app.get("/bands/:band", function(req, res) {
  Band.find({name: req.params.band}, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("band", {band: band[0]});
    }
  });
});

// start server
app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
