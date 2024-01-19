const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require the local passport mongoose to  use the mongoose
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});

// adding plugin for the automatic  salting adding