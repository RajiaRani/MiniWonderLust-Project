const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require the local passport
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});