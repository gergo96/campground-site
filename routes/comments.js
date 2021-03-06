var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res){
	// megkeressük a campground idjét
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});
// create
router.post("/", middleware.isLoggedIn, function(req,res){
	var newComment = req.body.comment; // a new.ejs fileban comment[author], és comment[text] -ként van elmentve, ezért hivatkozhatunk a teljes 		objektumra
	//Megkeressük a campground ID-ját
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//A megtalált campgroundhoz, elkészítjük a commentet
			Comment.create(newComment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save the comment
					comment.save();
					//add the comment to the campground then save it
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + req.params.id);
					console.log("New comment added to " + foundCampground.name);
				}
			});
		}
	});
});
//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err)
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;