var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//route rout
router.get("/", function(req,res){
	res.render("landing");
});
//AUTH ROUTES

//show register form route
router.get("/register", function(req,res){
	res.render("register.ejs");
});
 //handle sign up logic route
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message)
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Hello " + user.username + ", you successfully signed up");
			res.redirect("/campgrounds")
		});
	});
});

//SHOW LOGIN FORM

router.get("/login", function(req,res){
	res.render("login");
})
//HANDLING LOGIN FORM LOGIC
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/campgrounds", failureRedirect: "/login"
	}), function(req,res){
	req.flash("success", "LOGGED IN");
});

// LOG OUT ROUTE
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "You logged out")
	res.redirect("/campgrounds");
});

module.exports = router;