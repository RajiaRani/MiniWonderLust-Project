const express = require("express");
const router = express.Router();

router.get("/signup",(req,res) => {
    res.send("hello");
});


module.exports = router;