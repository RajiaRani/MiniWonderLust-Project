const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

//set the sessions options
const sessionOptions = {
    secret: "mysuperscretcode",
    resave: false, 
    saveUninitialized:true,
    cookie:{
       expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
       maxAge : 7 * 24 * 60 * 60 * 1000,
       httpOnly: true,
    }
  };

  //set the flash as a middleware
  

//root
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



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


//port
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});






