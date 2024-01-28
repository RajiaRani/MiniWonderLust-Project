
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
         // return res.redirect("/listings");
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}