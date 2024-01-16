const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");//change the path  according to their path
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js"); 



//Validate Listing Schema
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    //agar error exist karta hai to
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    };
};

//step:1 index route
router.get("/",  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
})
);


//Step:3 New Route
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});

//Step:2 show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
})
);


//Step:4 Create route
router.post(
    "/", validateListing , wrapAsync(async (req, res, next) => {
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // } 
        // if(!req.body.listing){
        //     throw new ExpressError(400, "Please enter the validate data.");
        // }
       const newListing = new Listing(req.body.listing);

    //    if(!newListing.description){
    //     throw new ExpressError(400,"description is missing!!");
    //    }

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
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });

})
);

//update route
router.put(
    "/:id", validateListing, wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect("/listings");
        //res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

})
);

module.exports = router;