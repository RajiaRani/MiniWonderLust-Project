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


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};