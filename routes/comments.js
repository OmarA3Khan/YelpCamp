var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index.js");

// new Comment
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else {
			res.render("comments/new", {campground: campground});			
		}
	});
});

// create new comment
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		}else{
			// console.log(req.body.comment);
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "something went wrong!");
					console.log(err);
				}else{
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// Save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Succesfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});

//Edit comment Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground : req.params.id, comment: foundComment});
		}
	})
});

// comment Update
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}else{
			req.flash("success", "Comment successfully updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// COMMENT DELETE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}else{
			req.flash("success", "comment Deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// // ========= MIDDLEWARE ======== //
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

module.exports = router;