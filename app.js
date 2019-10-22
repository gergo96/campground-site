var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	Campground 			= require("./models/campground"),
	Comment 			= require("./models/comment"),
	User				= require("./models/user"),
	passport 			= require("passport"),
	LocalStrategy 		= require("passport-local"),
	seedDB				= require("./seeds.js"),
	methodOverride 		= require("method-override");
 // requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	authRoutes			= require("./routes/index")


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://campground:campground@cluster0camgroundsite-batyi.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This can be antyhing what we want. Really.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){ 
	res.locals.currentUser = req.user; // ezt a middlewaret minden routeunknál futtatja, ezért hivatkozhatunk a currentUser-re minden ejs fájlunkban
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);


///////SERVER LISTEN
app.listen(3000, function(){
	console.log("SERVER ON!");
});