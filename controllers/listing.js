const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author"
      },
    })
    .populate("owner");

    //agar listing present nhi hai
    if(!listing){
        req.flash("error","Listing you requesting for does not exist.");
        res.redirect("/listings");
    };
    console.log(listing);
    res.render("listing/show.ejs", { listing });
};