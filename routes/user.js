const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router
.route("/signup")
.get(userController.renderSignupForm) //GET - signup
.post(wrapAsync(userController.signUp)); //POST - signup

router
.route("/login")
.get(userController.renderLoginForm) //GET - Login
.post(
    saveRedirectUrl, 
    //passport is a authenticate middleware
    passport.authenticate("local",{
        failureRedirect:"/login", 
        failureFlash:true,
    }), userController.logIn); //POST - Login



//GET-Logout 
router.get("/logout",userController.logOut);

module.exports = router;