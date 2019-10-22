var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // ha nem hivatkozunk konkrétan külön egy filera, automatikusan az index.js-t requireöljük

/////// ROUTES

//INDEX
router.get("/", function(req,res){
	// GET ALL CAMPGROUNDS FROM DATABASE
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err + "ERROR")
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	})
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var url = req.body.img;
	var description = req.body.description;
	var author = {id: req.user._id, username: req.user.username};
	
	var newCampground = {name: name, image: url, description: description, author: author};
	// Create a new Campground and save to the database
	Campground.create(newCampground, function(err, campground){
		if(err){
			res.redirect("/campgrounds");
			res.alert("something went wrong");
		} else {
			res.redirect("/campgrounds")
		}
	});
	//res.send("You are on /campgrounds ||| post");	
});

//SHOW
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});
//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});	
//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	var updatedCampground = { name: req.body.name, image: req.body.img, description: req.body.description };
	Campground.findByIdAndUpdate(req.params.id, updatedCampground ,function(err, editedCampground){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;