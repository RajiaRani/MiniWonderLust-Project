const express = require("express");
const app = express();
const expressSession = require("express-session");

const sessionOptions = {
    secret:"mysupersecretstring", 
    resave:false, 
    saveUninitialized:true
};

app.use(expressSession(sessionOptions));

app.get("/register", (req,res) => {
    let {name = "anonymous"} = req.query;
    console.log(`before`,req.session);
    req.session.name =name;
    console.log(req.session.name);
    console.log(`after`,req.session);
    // res.send(name);
    res.redirect("/greets");
});
app.get("/myage",(req,res) => {
    let {age = "none"} = req.query;
    req.session.age = age;
    console.log(req.session.age);
    res.redirect("/greets");

});

app.get("/greets", (req,res) => {
    res.send(`Hello,${req.session.name}`);
});


// app.get("/reqcount",(req,res) => {
    
//     if( req.session.count){
//         req.session.count++;
//     } else{
//         req.session.count = 1;
//     }
//     res.send(`You sent the request ${req.session.count} times`);
// });

// app.get("/test", (req,res)=> {
//     res.send("test successfull");
// });

app.listen(3000, (req,res) => {
    console.log("i am listing on port 3000");
});
