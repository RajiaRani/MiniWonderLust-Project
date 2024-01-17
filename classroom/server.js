const express = require("express");
const app = express();
const expressSession = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret:"mysupersecretstring", 
    resave:false, 
    saveUninitialized:true
};

app.use(expressSession(sessionOptions));
app.use(flash());

//middleware of res.locals
app.use((req,res,next) => {
 res.locals.sucessMsg = req.flash("sucess");
 req.locals.errorMsg = req.flash("error");
 next();
});

app.get("/register", (req,res) => {
    let {name = "anonymous"} = req.query;
    //console.log(`before`,req.session);
    req.session.name =name;
    //console.log(req.session.name);
    //console.log(`after`,req.session);
    // res.send(name);
    if(name === "anonymous") {
        req.flash("error", "Sorry!! user is not registered.");
    } else{
        req.flash("sucess","user registered sucessfully");
    }
  
    res.redirect("/greets");
});
// app.get("/myage",(req,res) => {
//     let {age = "none"} = req.query;
//     req.session.age = age;
//     console.log(req.session.age);
//     res.redirect("/age");

// });

app.get("/greets", (req,res) => {
    // res.send(`Hello,${req.session.name}`);
    res.render("page.ejs",{name:req.session.name});

});

// app.get("/age", (req,res) => {
//    res.send(`your age is ${req.session.age}`);
// });


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
