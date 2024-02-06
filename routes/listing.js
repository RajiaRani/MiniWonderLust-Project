const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");//change the path  according to their path
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

router
.route("/")
.get( wrapAsync(listingController.index)) //step:1 index route
.post(
    isLoggedIn,
    validateListing , 
    wrapAsync(listingController.createListing)
    ); //Step:4 Create route



//Step:3 New Route
router.get(
    "/new",
    //isLoggedIn is a middleware to check that humara user ne login kiya hai ya nhi
     isLoggedIn,(listingController.renderNewForm ));


//Step:2 show route
router.get("/:id", 
        wrapAsync(listingController.showListing));



//Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editForm));

//update route
router.put(
    "/:id", 
    isLoggedIn,
    isOwner,
    validateListing,
     wrapAsync(listingController.updateForm));

//DELETE ROUTE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.destroyListing));

module.exports = router;