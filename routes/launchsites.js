var express = require("express");
var router = express.Router();
var Launchsite = require("../models/launchsite");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX route - show all launchsites
router.get("/", function(req, res){
	// 	get all launchsites from DB
	Launchsite.find({}, function(err, allLaunchsites){
		if(err){
			console.log(err);
		} else {
			res.render("launchsites/index", {launchsites: allLaunchsites, page: 'launchsites'});
		}
	});
});

// CREATE route - add a new launchsite to DB(action)
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to launchsites array
  var name = req.body.name;
  var image = req.body.image;
  var officialSite = req.body.officialSite;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newLaunchsite = {name: name, image: image, officialSite: officialSite, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new launchsite and save to DB
    Launchsite.create(newLaunchsite, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to launchsites page
            console.log(newlyCreated);
            res.redirect("/launchsites");
        }
    });
  });
});

// NEW route - show the form to create a new launchsite
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("launchsites/new");
})

// SHOW route - show more info about one launchsite
router.get("/:id", function(req, res){
	// find the launchsite with provided ID
	Launchsite.findById(req.params.id).populate("comments").exec(function(err, foundLaunchsite){
		if(err){
			console.log(err);
		} else {
			console.log(foundLaunchsite);
			// render show template with that launchsite
			res.render("launchsites/show", {launchsite: foundLaunchsite});
		}
	})
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkLaunchsiteOwnership, function(req, res){
	Launchsite.findById(req.params.id, function(err, foundLaunchsite){
		res.render("launchsites/edit", {launchsite: foundLaunchsite});
	})
});
// UPDATE ROUTE
router.put("/:id", middleware.checkLaunchsiteOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.launchsite.lat = data[0].latitude;
    req.body.launchsite.lng = data[0].longitude;
    req.body.launchsite.location = data[0].formattedAddress;

    Launchsite.findByIdAndUpdate(req.params.id, req.body.launchsite, function(err, launchsite){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/launchsites/" + launchsite._id);
        }
    });
  });
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkLaunchsiteOwnership, function(req, res){
	Launchsite.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/launchsites");
		} else {
			res.redirect("/launchsites");
		}
	})
});

module.exports = router;