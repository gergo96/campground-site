var mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comment");

var data = [
	{
		name: "Pilisi erdő",
		image: "https://images.unsplash.com/photo-1480779735619-f73b30fdc062?ixlib=rb1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},{
		name: "Rainy Forrest",
		image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1388&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},{
		name: "Deep Forrest",
		image: "https://images.unsplash.com/photo-1535049883634-993346531df6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
];

function seedDB(){
	Campground.remove({}, function(err){
	if(err){
		console.log(err);
	}
	console.log("removed campgrounds");
	data.forEach(function(seed){   // seed = objektum a tömbből (tehát egy camp)
		Campground.create(seed, function(err, campground){
			if(err){
				console.log(err);
			} else {
				console.log("added a campground");
				//create a comment
				Comment.create(
				{
					text: "This is a nice place, but sometimes there are aliens!",
					author: "Bob Lazar"
					
				}, function(err, comment){
					if(err){
						console.log(err);
					} else {
						campground.comments.push(comment);
						campground.save();
						console.log("created new campground");
					}
				});
			}
		});
	});
	});
}

module.exports = seedDB;