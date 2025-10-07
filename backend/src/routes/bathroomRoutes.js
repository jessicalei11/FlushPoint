const express = require("express");
const cloudinary = require("cloudinary");
const Bathroom = require("../models/Bathroom.js");
const protectRoute = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/", async (req , res) => {
    try {
        const {name, latitude, longitude} = req.body;

        if (!name || !latitude || !longitude){
            return res.status.json({message: "Please provide all fields."});
        }

        /*
        To upload images to cloudinary:
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
        */

        const newBathroom = new Bathroom({
            name,
            latitude,
            longitude,
            user: req.user._id,
        })

        await newBathroom.save();

        res.status(201).json(newBook);

    } catch (error) {
        console.log("Error creating bathroom", error);
        res.status(500).json({ message: error.message});
    }
});

module.exports = router;