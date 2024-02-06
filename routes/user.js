const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//GET - signup
router.get("/signup",userController.renderSignupForm);

//POST - signup
router.post("/signup",
      wrapAsync(userController.signUp));

//GET - Login
router.get("/login", userController.renderLoginForm);

//POST - Login
router.post(
    "/login", 
    saveRedirectUrl, 
    //passport is a authenticate middleware
    passport.authenticate("local",{
        failureRedirect:"/login", 
        failureFlash:true,
    }), userController.logIn);


//GET-Logout 
router.get("/logout",userController.logOut);

module.exports = router;