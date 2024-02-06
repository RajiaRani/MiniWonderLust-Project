 const Listing = require("./routes/listing");
 const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js"); 
const { reviewSchema  } = require("./schema.js");
 
 //Validate Listing Schema
module.exports.validateListing = (req,res,next) => {
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
module.exports.validateReview = ((req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError (400, errMsg);
    } else {
        next();
    };
});



 //isLoggedIn is a middleware to check that humara user ne login kiya hai ya nhi
module.exports.isLoggedIn = (req, res, next) => {
   // console.log(req);
   //console.log(req.path, "..", req.originalUrl);
    //console.log(req.user);
    if (!req.isAuthenticated()) {
         // return res.redirect("/listings");
          req.session.redirectUrl = req.originalUrl; //agar user loggedIn nhi hai
          req.flash("error", "you must be logged in to doing something in listing");
         return res.redirect("/login");

    }
    next();
};

//redirect URL ko save karne ke liye
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) //agar ko redirect variable present hais 
    {
        res.locals.redirectUrl = req.session.redirectUrl;  //usko locals mein save kar lege
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!currUser && listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "Opps!  you don't havae permission to edit");
    res.redirect(`/listings/${id}`);
    }
    next();
}