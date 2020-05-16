// import express, body-parser and mongoose
require('dotenv').config();
var express     = require("express"),
	app         = express(),
	bodyParser  = require("body-parser"),
	mongoose    = require("mongoose"),
	flash       = require("connect-flash"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Launchsite  = require("./models/launchsite"),
	Comment     = require("./models/comment"),
	User        = require("./models/user"),
	seedDB      = require("./seeds");

// require routes
var commentRoutes    = require("./routes/comments"),
	launchsiteRoutes = require("./routes/launchsites"),
	indexRoutes      = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/RocketLaunchSites"
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// use css
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // use seed to create initial database

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION (LOGIN AND LOGOUT)
app.use(require("express-session")({
	secret: "u see secret!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local user to current loggedin user
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// set other pages
app.use("/launchsites", launchsiteRoutes);
app.use("/", indexRoutes);
app.use("/launchsites/:id/comments", commentRoutes);

// listen to request
app.listen(process.env.PORT || 3000, function(){
	console.log("The RocketLaunchSites Server is started!");
});