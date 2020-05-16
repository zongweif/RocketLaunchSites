var Launchsite = require("../models/launchsite");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkLaunchsiteOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Launchsite.findById(req.params.id, function(err, foundLaunchsite){
			if(err){
				req.flash("error", "Launchsite not found");
				res.redirect("back");
			} else {
				// if logged in , does user own this launchsite post
				if(foundLaunchsite.author.id.equals(req.user._id) || req.user.isAdmin){
					// if own, could edit or delete
					next();
				} else {
					// if not own, redirect
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	} else {
		// if not logged in, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				// if logged in , does user own this comment
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					// if own, could edit or delete
					next();
				} else {
					// if not own, redirect
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	} else {
		// if not logged in, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;