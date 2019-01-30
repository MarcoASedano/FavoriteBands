var express = require("express");
var router  = express.Router({mergeParams: true});
var Band    = require("../models/band");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {band: band});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
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
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          band.comments.push(comment);
          band.save();
          res.redirect("/bands/" + band._id);
        }
      })
    }
  });
});

module.exports = router;
