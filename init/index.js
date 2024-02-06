const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoURL = "mongodb://127.0.0.1:27017/wonderlust";
main()
.then((res) => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(mongoURL);
};

//create the new data
const initDB = async () =>{
    await Listing.deleteMany({}); //delete all the data before adding new data files
    initData.data = initData.data.map((obj)=> ({...obj, owner:"65b5b9bf307524fb5197fdde"})); //ye method se hum apne har ek listing ek inside owner property ko add kar dege with same owner_id
    await Listing.insertMany(initData.data); //add the data from initdata(object)
    console.log("data was initialized");
};

initDB(); //call the DB function