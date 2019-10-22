// all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWareObj = {};

middleWareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found")
				console.log(err)
			} else {
				if(req.user._id.equals(foundCampground.author.id)){
					next();
				} else {
					req.flash("error", "You dont have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middleWareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found")
				console.log(err)
			} else {
				if(req.user._id.equals(foundComment.author.id)){
					next();
				} else {
					req.flash("error", "You dont have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middleWareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login");
}

module.exports = middleWareObj;