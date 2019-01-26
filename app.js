var express         = require("express"),
    app             = express();
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");
    mongoose        = require("mongoose")
    request         = require("request");

//connect to mongoose server
mongoose.connect("mongodb://localhost/favoritebands", {useNewUrlParser: true});

// set public directory for static files
app.use(express.static("public"));

// use bodyParser to parse incoming post requests
app.use(bodyParser.urlencoded({extended: true}));

// allow put and delete request in html forms
app.use(methodOverride("_method"));

// set view engine to use ejs templates
app.set("view engine", "ejs");

// Schema Setup
var bandSchema = new mongoose.Schema({
  name: String,
  img: String,
  wiki: String
});

var Band = mongoose.model("Band", bandSchema);

//****** ROUTES ********//

app.get("/", function(req, res) {
  res.redirect("/bands");
});

// INDEX that shows all bands
app.get("/bands", function(req, res) {
  Band.find({}, function(err, allBands) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {bands: allBands});
    }
  })
});

// form to add a NEW band
app.get("/bands/new", function(req, res) {
  res.render("new");
});

// CREATE new band object to database
app.post("/bands", function(req, res) {
  Band.create(req.body.band, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bands/" + band.id);
    }
  });
});

// GET more information about one band
app.get("/bands/:id", function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("band", {band: band});
    }
  });
});

// Get form to EDIT a specific band
app.get("/bands/:id/edit", function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", {band: band});
    }
  });
});

// EDIT a specific band
app.put("/bands/:id", function(req, res) {
  Band.findByIdAndUpdate(req.params.id, req.body.band, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bands/" + req.params.id);
    }
  });
});

// DELETE a specific band
app.delete("/bands/:id", function(req, res) {
  Band.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bands");
    }
  });
});

// start server
app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
