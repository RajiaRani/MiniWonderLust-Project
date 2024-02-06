const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({}); //collected all the data from mongodb
    res.render("listing/index.ejs", { allListing });
}