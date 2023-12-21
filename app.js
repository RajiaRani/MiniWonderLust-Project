const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


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
app.get("/", (req,res) => {
    res.send("Hi, I am root");
});

//step:1 index route
app.get("/listings" , async(req,res) => {
    const allListing =  await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", {allListing});
});


//Step:3 New Route
app.get("/listings/new", (req,res) => {
    res.render("listing/new.ejs");
});


//Step:2 show route
app.get("/listings/:id", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", {listing});
});


//Step:4 Create route
app.post("/listings", async(req,res) => {
 //let {title, description, image, price, location, country} = req.body;
 //let listing = req.body;
// let listing = req.body.listing;
 //console.log(listing);
const newListing = new Listing(req.body.listing);
await newListing.save();
 res.redirect("/listings");
});


//Edit route
app.get("/listings/:id/edit", async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", {listing});
    
});

//update route
app.put("/listings/:id", async(req,res) => {
    let {id} =req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing });
   res.redirect("/listings");
   //res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});



//port
app.listen(8080, () =>{
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





