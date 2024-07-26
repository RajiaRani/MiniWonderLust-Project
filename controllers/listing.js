const Listing = require("../models/listing");
//MapBox
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken =  process.env.MAP_TOKEN ;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});

//INDEX ROUTE
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
}

//NEW FORM RENDER
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}


//SHOW ROUTE
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
    //console.log(listing);
    res.render("listing/show.ejs", { listing, hereMapsApiKey: process.env.HERE_MAPS_API_KEY  });
};

//CREATE ROUTE
module.exports.createListing = async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // } 
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Please enter the validate data.");
    // }

 try{
    let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();
    
  //console.log(response.body.features[0].geometry);
  if (response.body.features.length === 0) {
      req.flash("error", "Location not found");
      return res.redirect("/listings/new");
  }


  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};

  newListing.geometry = response.body.features[0].geometry;


 if(!newListing.description){
  throw new ExpressError(400,"description is missing!!");
 }
 
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "listing added successfully!");
  res.redirect(`/listings`);
 } catch(ee) {
    console.log(err);
    next(err);
 }
};


//EDIT FORM
module.exports.editForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","listing editted successfully!!");
    //agar listing present nhi hai

    if(!listing){
        req.flash("error","Listing you requesting for does not exist.");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
    res.render("listing/edit.ejs", { listing, originalImageUrl });

};

//UPDATE ROUTE
module.exports.updateForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if(typeof req.file!= "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
   }

    req.flash("success","listing updated successfully!!");
    res.redirect(`/listings/${id}`);
    //res.redirect(`/listings/${id}`);
};

//Filter
module.exports.filterByCategory = async (req, res) => {
    const { category } = req.query;
    const filteredListings = await Listing.find({ category });
    res.render("listing/index.ejs", { allListing: filteredListings });
};

// DELETE ROUTE
module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");

};