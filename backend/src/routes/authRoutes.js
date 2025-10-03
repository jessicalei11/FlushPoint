const express = require("express");

const router = express.Router();

router.post("/register", async (req, res) =>{
    res.send("register");
})

router.post("/login", async (req, res) =>{
    res.send("login");
})

module.exports = router;