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