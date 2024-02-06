const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};


module.exports.signUp = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser =  new User({username,email});
        const registeredUser = await User.register(newUser,password);//user ko register karne ke liye
        console.log(registeredUser);
        //automatic login the user
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust!!");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
};

module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.logIn = async(req,res) => {
    // res.send("Welcome to Wonderlust you are logged in !");
    req.flash("success","Welcome back to Wondelust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    };

module.exports.logOut = (req,res,next) => {
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success" , "logout successfully!!");
        res.redirect("/listings");
    })
};