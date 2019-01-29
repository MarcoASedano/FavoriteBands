var express         = require("express"),
    app             = express();
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");
    mongoose        = require("mongoose");
    passport        = require("passport");
    LocalStrategy   = require("passport-local");
    Band            = require("./models/band")
    Comment         = require("./models/comment");
    User            = require("./models/user");
    request         = require("request");

//connect to mongoose server
mongoose.connect("mongodb://localhost/favoritebands", {useNewUrlParser: true});

// set public directory for static files
app.use(express.static(__dirname + "/public"));

// use bodyParser to parse incoming post requests
app.use(bodyParser.urlencoded({extended: true}));

// allow put and delete request in html forms
app.use(methodOverride("_method"));

// set view engine to use ejs templates
app.set("view engine", "ejs");

// configure PASSPORT for authentication
app.use(require("express-session")({
  secret: "This will be used to encrypt",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to let user info be available in every route
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

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
      var sortedBands = allBands.sort(function(a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      res.render("bands/index", {bands: sortedBands});
    }
  })
});

// form to add a NEW band
app.get("/bands/new", function(req, res) {
  res.render("bands/new");
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
  Band.findById(req.params.id).populate("comments").exec(function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("bands/band", {band: band});
    }
  });
});

// Get form to EDIT a specific band
app.get("/bands/:id/edit", function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("bands/edit", {band: band});
    }
  });
});

// EDIT a specific band
app.put("/bands/:id", function(req, res) {
  Band.findByIdAndUpdate(req.params.id, req.body.band, function(err, band) {
    if (err) {
      console.log(err);
      res.redirect("/bands");
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
      res.redirect("/bands");
    } else {
      res.redirect("/bands");
    }
  });
});

//====================
// Comment Routes
//====================

app.get("/bands/:id/comments/new", isLoggedIn, function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {band: band});
    }
  });
});

app.post("/bands/:id/comments", isLoggedIn, function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
      res.redirect("/bands");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        }
        else {
          band.comments.push(comment);
          band.save();
          res.redirect("/bands/" + band._id);
        }
      })
    }
  });
})

// AUTHENTICATION Routes
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/bands");
    });
  });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/bands",
    failureRedirect: "/login"
  }), function(req, res) {
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/bands");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

// start server
app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
