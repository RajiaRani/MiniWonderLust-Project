const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require the local passport mongoose to  use the mongoose
const passportLocalMongoose = require("passport-local-mongoose");

//creating schema for User
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});

// adding plugin for the automatic  salting addition in Schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;