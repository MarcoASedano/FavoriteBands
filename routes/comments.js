var express = require("express");
var router  = express.Router({mergeParams: true});
var Band    = require("../models/band");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {band: band});
    }
  });
});

router.post("/", isLoggedIn, function(req, res) {
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
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
