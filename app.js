const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js"); 
const { reviewSchema  } = require("./schema.js");
const Review = require("./models/review.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const mongoURL = "mongodb://127.0.0.1:27017/wonderlust";
main()
    .then((res) => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoURL);
};



//root
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


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


//step:1 index route
app.get("/listings",  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
})
);


//Step:3 New Route
app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
});


//Step:2 show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
})
)


//Step:4 Create route
app.post(
    "/listings", validateListing , wrapAsync(async (req, res, next) => {
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
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });

})
)

//update route
app.put(
    "/listings/:id", validateListing, wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect("/listings");
        //res.redirect(`/listings/${id}`);
    })
)

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

})
)


//Reviews
//POST ROUTE
app.post("/listings/:id/reviews", 
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
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=> {
    let {id} = req.params; //extracts the listing id
    let { reviewId} = req.params; //extracts the reviews id
     
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})
);



//STANDARD ERROR RESPONSE
app.all("*", (req, res, next) => {
    //console.log("404 middleware triggered");
    next(new ExpressError(404, "Opps!! Page Not Found!"));
});


//Error handling using ExpressError
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err;
    //res.status(statusCode).send(message);
    //res.render("errors.ejs", {err})
    res.status(statusCode).render("errors.ejs", {message});
   // res.status(statusCode).render("errors.ejs", {err});

});

//error
//  app.use((err,req,res,next) => {
//     res.send("something is wrong!!");
// });


//port
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

// app.get("/testListing", (req,res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "By the beach.",
//         price: 120000,
//         loction: "Calongute, Goa",
//         country: "India"
//     });
//     sampleListing .save()
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//     res.send("successfull");
// });





