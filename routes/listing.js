const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");//change the path  according to their path
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//require multer for the images uploading
const multer  = require('multer');
const {storage} = require("../cloudconf.js");
const upload = multer({ storage });


router
.route("/")
.get( wrapAsync(listingController.index)) //step:1 index route
.post(
     isLoggedIn,
     upload.single("listing[image]"),
     validateListing , 
     wrapAsync(listingController.createListing)
    ); //Step:4 Create route



//Step:3 New Route
router.get(
    "/new",
    //isLoggedIn is a middleware to check that humara user ne login kiya hai ya nhi
     isLoggedIn,(listingController.renderNewForm ));


router
.route("/:id")
//Step:2 show route
.get(wrapAsync(listingController.showListing)) 
//update route
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.updateForm)) 
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)); //DELETE ROUTE



//Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editForm));

module.exports = router;