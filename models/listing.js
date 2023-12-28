const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
     image:{
      type: String,
        default: 
        "https://images.unsplash.com/photo-1512438925562-6b0f35961d77?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2glMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D",
      set: (v) =>
         v === " " ? "https://images.unsplash.com/photo-1512438925562-6b0f35961d77?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2glMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D": v,
     },
    price: Number,
    location: String,
    country: String,

    //add the review data
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;