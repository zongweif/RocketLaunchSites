var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// set the landing page (root route)
router.get("/", function(req, res){
	res.render("landing");
});

// =============
// AUTH ROUTES (LOGIN AND LOGOUT)
// =============

// show register form
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});
// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === "secretcode126") {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to RocketLaunchSites " + user.username);
			res.redirect("/launchsites");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});
// handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/launchsites",
	failureRedirect: "/login"
}), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/launchsites");
});

module.exports = router;