const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
let { id } = req.params; // Access the listing (find by ID)
let listing = await Listing.findById(id);

let newReview = new Review(req.body.reviews); // Create a new Review based on req.body.reviews
newReview.author = req.user._id; 
//console.log(newReview);
listing.reviews.push(newReview); // Push the new review to the listing's reviews array
await newReview.save(); // Save the new review and the updated listing
await listing.save();
// console.log("New review saved");
// console.log(req.body);
// res.send("New review saved!");
//console.log(listing);

req.flash("success","review added");
res.redirect(`/listings/${listing._id}`); //redirect to the show page itself
};


module.exports.destroyReview = async(req,res)=> {
    let {id} = req.params; //extracts the listing id
    let { reviewId} = req.params; //extracts the reviews id
     
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
};