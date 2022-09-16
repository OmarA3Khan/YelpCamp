var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");

// Requiring Routes here
var commentRoutes     = require("./routes/comments");
var campgroundRoutes  = require("./routes/campgrounds");
var	indexRoutes       = require("./routes/index");

mongoose.connect('mongodb+srv://LoganWayne:ricardokaka@YelpCamp.31foa.mongodb.net/YelpCamp?retryWrites=true&w=majority', { useNewUrlParser: true });
// "mongodb+srv://LoganWayne:ricardokaka@YelpCamp.31foa.mongodb.net/YelpCamp?retryWrites=true&w=majority"
// mongodb+srv://LoganWayne:<password>@yelpcamp.31foa.mongodb.net/?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// === PASSPORT CONFIG ===== //
app.use(require("express-session")({
	secret: "Rocoblet is Real",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp server has started");
});