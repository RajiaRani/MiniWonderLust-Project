const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");//change the path  according to their path
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



//step:1 index route
router.get("/",  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
})
);


//Step:3 New Route
router.get(
    "/new",
    //isLoggedIn is a middleware to check that humara user ne login kiya hai ya nhi
     isLoggedIn,
     (req, res) => {
      res.render("listing/new.ejs");
});


//Step:2 show route
router.get("/:id", 
        wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");

    //agar listing present nhi hai
    if(!listing){
        req.flash("error","Listing you requesting for does not exist.");
        res.redirect("/listings");
    };
    console.log(listing);
    res.render("listing/show.ejs", { listing });
})
);


//Step:4 Create route
router.post(
      "/", 
      isLoggedIn,
      validateListing , 
      wrapAsync(async (req, res, next) => {
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // } 
        // if(!req.body.listing){
        //     throw new ExpressError(400, "Please enter the validate data.");
        // }
       const newListing = new Listing(req.body.listing);
       newListing.owner = req.user._id;
    //    if(!newListing.description){
    //     throw new ExpressError(400,"description is missing!!");
    //    }
        req.flash("success", "listing added successfully!");
        await newListing.save();
        res.redirect("/listings");
    })
);



// app.post("/listings", async (req, res,next) => {
//     //let {title, description, image, price, location, country} = req.body;
//     //let listing = req.body;
//     // let listing = req.body.listing;
//     //console.log(listing);
//     try {
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     } catch (err) {
//         next(err);
//     };

// });


//Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","listing editted successfully!!");
    //agar listing present nhi hai
    if(!listing){
        req.flash("error","Listing you requesting for does not exist.");
        res.redirect("/listings");
    };

    res.render("listing/edit.ejs", { listing });

})
);

//update route
router.put(
    "/:id", 
    isLoggedIn,
    isOwner,
    validateListing,
     wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success","listing updated successfully!!");
        res.redirect("/listings");
        //res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");

})
);

module.exports = router;