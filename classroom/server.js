const express = require("express");
const app = express();
const expressSession = require("express-session");

app.use(expressSession({
    secret:"mysupersecretstring", 
    resave:false, 
    saveUninitialized:true})
    );

app.get("/reqcount",(req,res) => {
    let req_count = req.session.count;
    
    if(req_count){
        req_count++;
    } else{
        req_count = 1;
    }
    res.send(`You sent the request ${req_count} times`);
});

// app.get("/test", (req,res)=> {
//     res.send("test successfull");
// });

app.listen(3000, (req,res) => {
    console.log("i am listing on port 3000");
});
