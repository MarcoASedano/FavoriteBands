var express = require("express");
var router  = express.Router();
var Band    = require("../models/band");

router.get("/", function(req, res) {
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

router.get("/new", isLoggedIn, function(req, res) {
  res.render("bands/new");
});

router.post("/", isLoggedIn, function(req, res) {
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var reqBand = req.body.band;
  reqBand.author = author;
  Band.create(reqBand, function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bands/" + band.id);
    }
  });
});

router.get("/:id", function(req, res) {
  Band.findById(req.params.id).populate("comments").exec(function(err, band) {
    if (err) {
      console.log(err);
    } else {
      res.render("bands/band", {band: band});
    }
  });
});

router.get("/:id/edit", checkBandOwnership, function(req, res) {
  Band.findById(req.params.id, function(err, band) {
    if (err) {
      res.redirect("/bands");
    } else {
      res.render("bands/edit", {band: band});
    }
  });
});

router.put("/:id", checkBandOwnership, function(req, res) {
  Band.findByIdAndUpdate(req.params.id, req.body.band, function(err, band) {
    if (err) {
      console.log(err);
      res.redirect("/bands");
    } else {
      res.redirect("/bands/" + req.params.id);
    }
  });
});

router.delete("/:id", checkBandOwnership, function(req, res) {
  Band.findByIdAndRemove(req.params.id, function(err, bandRemoved) {
    if (err) {
      console.log(err);
    }
    Comment.deleteMany( {_id: {$in: bandRemoved.comments } }, function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect("/bands");
    });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkBandOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Band.findById(req.params.id, function(err, band) {
      if (err) {
        res.redirect("back");
      } else {
        if (band.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
