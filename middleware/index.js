var Campground = require("../models/campground");
var Comments = require("../models/comment")

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				console.log(err);
				req.flash("error", "Campground not found");
				res.redirect("back");
			}else{
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
            	}
			
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You dont have permission to do that !");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comments.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log(err);
				req.flash("error", "couldn't find comment");
				res.redirect("back");
			}else{
				if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
            	}
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "YOU NEED TO BE LOGGED IN TO DO THAT");
	res.redirect("/login");
}

module.exports = middlewareObj