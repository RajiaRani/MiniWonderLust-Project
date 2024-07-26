if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
//console.log(process.env.SECRET);


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");

//require passport-strategy
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//router 
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

const mongoURL = "mongodb://127.0.0.1:27017/wonderlust";
main()
    .then((res) => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
};


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
       secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 
});

store.on("error" ,() => {
    console.log("error in connect-mongo", error)
});

//set the sessions options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


//root
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });





//session as a middleware
app.use(session(sessionOptions));
app.use(flash());
//use passport as a middleware first initialize before we use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//serialize me addition user into session
//deserialize means removing user from session after user exist the site
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set the flash as a middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    //console.log(success);
    next();
});


//router
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// app.get("/demouser", async(req,res) =>{
//     let fakeUser = new User ({
//          email : "student@gmail.com",
//          username : "delta-student",
//     });
//    let registerUser =  await User.register(fakeUser,"helloworld");
//    //console.log(registerUser);
//    res.send(registerUser);
// });


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
    res.status(statusCode).render("errors.ejs", { message });
    // res.status(statusCode).render("errors.ejs", {err});

});


//port
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});






