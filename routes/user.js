const express = require("express");
const router = express.Router();

router.get("/signup",(req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res) => {
    let {username, email, password} = req.body;
    const newUser =  new User({username,email});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
});


module.exports = router;