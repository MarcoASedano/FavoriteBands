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

// routes
var bandRoutes     = require("./routes/bands"),
    commentRoutes  = require("./routes/comments"),
    indexRoutes    = require("./routes/index");

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

app.use("/", indexRoutes);
app.use("/bands", bandRoutes);
app.use("/bands/:id/comments", commentRoutes);

// start server
app.listen(3000, function() {
  console.log("The FavoriteBands server has started!");
});
