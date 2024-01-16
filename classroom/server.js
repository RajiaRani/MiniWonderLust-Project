const express = require("express");
const app = express();
const expressSession = require("express-session");

app.use(expressSession({
    secret:"mysupersecretstring", 
    resave:false, 
    saveUninitialized:true})
    );

app.get("/reqcount",(req,res) => {
    
    if( req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1;
    }
    res.send(`You sent the request ${req.session.count} times`);
});

// app.get("/test", (req,res)=> {
//     res.send("test successfull");
// });

app.listen(3000, (req,res) => {
    console.log("i am listing on port 3000");
});
