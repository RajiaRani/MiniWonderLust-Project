const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema  = new Schema({
    //creating comment, rating and createdAt
    comment:String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
     },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Review", reviewSchema);
// const Review = mongoose.model("Review", reviewSchema );
// module.exports = Review;