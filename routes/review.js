const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
 const reviewController = require("../controllers/review.js");


//Reviews
//POST ROUTE
router.post("/", 
         isLoggedIn,
         validateReview, 
         wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", 
       isLoggedIn,
       isReviewAuthor,
       wrapAsync(async(req,res)=> {
    let {id} = req.params; //extracts the listing id
    let { reviewId} = req.params; //extracts the reviews id
     
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;