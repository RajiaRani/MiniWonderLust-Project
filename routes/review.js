const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn} = require("../middleware.js");



//Reviews
//POST ROUTE
router.post("/", 
         isLoggedIn,
         validateReview, 
         wrapAsync(async (req, res) => 
         {
    // Access the listing (find by ID)
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Create a new Review based on req.body.reviews
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id; 
    //console.log(newReview);
    // Push the new review to the listing's reviews array
    listing.reviews.push(newReview);

    // Save the new review and the updated listing
    await newReview.save();
    await listing.save();

    // console.log("New review saved");
    // console.log(req.body);
    // res.send("New review saved!");
    //console.log(listing);

    //redirect to the show page itself
    req.flash("success","review added");
    res.redirect(`/listings/${listing._id}`);
})
);

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req,res)=> {
    let {id} = req.params; //extracts the listing id
    let { reviewId} = req.params; //extracts the reviews id
     
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;