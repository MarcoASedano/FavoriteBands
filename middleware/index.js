var Band = require("../models/band");

var middlewareObj = {};

middlewareObj.checkBandOwnership = function(req, res, next) {
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


middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = middlewareObj;
