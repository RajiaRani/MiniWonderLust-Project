const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
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

module.exports.createListing = async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // } 
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Please enter the validate data.");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
//    if(!newListing.description){
//     throw new ExpressError(400,"description is missing!!");
//    }
    req.flash("success", "listing added successfully!");
    await newListing.save();
    res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","listing editted successfully!!");
    //agar listing present nhi hai
    if(!listing){
        req.flash("error","Listing you requesting for does not exist.");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });

};

module.exports.updateForm = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","listing updated successfully!!");
    res.redirect(`/listings/${id}`);
    //res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");

};