const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//GET - signup
router.get("/signup",(req,res) => {
    res.render("users/signup.ejs");
});

//POST - signup
router.post("/signup",
      wrapAsync(async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser =  new User({username,email});
        const registeredUser = await User.register(newUser,password);//user ko register karne ke liye
        console.log(registeredUser);
        //automatic login the user
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust!!");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
})
);

//GET - Login
router.get("/login", (req,res) =>{
    res.render("users/login.ejs");
});

//POST - Login
router.post(
    "/login", 
    saveRedirectUrl, 
    //passport is a authenticate middleware
    passport.authenticate("local",{
        failureRedirect:"/login", 
        failureFlash:true,
    }), 
    async(req,res) => {
    // res.send("Welcome to Wonderlust you are logged in !");
    req.flash("success","Welcome back to Wondelust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    });

//GET-Logout 
router.get("/logout", (req,res,next) => {
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success" , "logout successfully!!");
        res.redirect("/listings");
    })
})

module.exports = router;