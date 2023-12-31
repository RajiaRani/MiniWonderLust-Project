const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const { wrap } = require("module");
// const { reverse } = require("dns");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema} = require("./schema.js");
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

//step:1 index route
app.get("/listings", wrapAsync(async (req, res) => {
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
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
})
);


//Step:4 Create route
app.post("/listings", wrapAsync(async (req, res,next) => {
  
    const newListing = new Listing(req.body.listing);
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
);

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
    //res.redirect(`/listings/${id}`);
})
);

//delete route
app.delete("/listings/:id", async (req, res) => {
    try{
        let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    } catch(err) {
        next(err);
    }
});


//Reviews
//Post Route
app.post("/listings/:id/reviews", async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review ( req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new ewview added.");
    res.send("new review added!!");
})

// Error handling part
// app.use((err,req,res,next) => {
//     res.send("something went wrong!!");
// });


// Error handling part
//app.all("*", (req,res,next) =>{ next(new ExpressError(404, "Page Not Found!!"));});

// app.use((req,res,next) => {
//     let {statusCode = 505 , message = " Opps!! Sorry Something wents wrong!"} = err;
//     res.status(statusCode).send(message);
// });
//STANDARD ERROR RESPONSE
app.use("*", (req,res,next))
//Error handling using ExpressError
app.use((req,res,next)=> {
    let {statusCode=401, message="Opps! Sorry Something wents wrong!!"} = err;
    res.status(statusCode).send(message);
});

//error
// app.use((err,req,res,next) => {
//     res.send("Something is wrong!");
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





