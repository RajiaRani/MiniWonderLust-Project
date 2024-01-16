const express = require("express");
const app = express();
const expressSession = require("express-session");

app.use(expressSession({secret:"mysupersecretstring"}));

app.get("/reqcount",(req,res) => {
    res.send("you sent a request x times");
});

// app.get("/test", (req,res)=> {
//     res.send("test successfull");
// });

app.listen(3000, (req,res) => {
    console.log("i am listing on port 3000");
});
