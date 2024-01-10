const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema  } = require("../schema.js");
const Review = require("../models/review.js");

//validate Review Schema
const validateReview = ((req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError (400, errMsg);
    } else {
        next();
    };
});


//Reviews
//POST ROUTE
router.post("/", 
         validateReview, 
         wrapAsync(async (req, res) => 
         {
    // Access the listing (find by ID)
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Create a new Review based on req.body.reviews
    let newReview = new Review(req.body.reviews);
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
    res.redirect(`/listings/${listing._id}`);
})
);

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req,res)=> {
    let {id} = req.params; //extracts the listing id
    let { reviewId} = req.params; //extracts the reviews id
     
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;