const express = require("express");
const cloudinary = require("cloudinary");
const Bathroom = require("../models/Bathroom.js");
const protectRoute = require("../middleware/auth.js");
const Review = require('../models/Review'); 

const mongoose = require('mongoose');

const router = express.Router();

router.post("/", protectRoute, async (req , res) => {
    try {
        const {name, description, latitude, longitude, image} = req.body;

        if (!name || !latitude || !longitude || !description || !image){
            return res.status(400).json({message: "Please provide all fields."});
        }

        let imageUrl = image;

        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "bathroom_images" 
        });

        imageUrl = uploadResponse.secure_url;        

        const newBathroom = new Bathroom({
            name,
            description,
            latitude,
            longitude,
            image: imageUrl,
            user: req.user._id,
        })

        await newBathroom.save();

        res.status(201).json(newBathroom);

    } catch (error) {
        console.log("Error creating bathroom", error);
        res.status(500).json({ message: "Failed to create bathroom: " + error.message});
    }
});

router.get("/",protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const totalBathroom = await Bathroom.countDocuments();

        const bathrooms = await Bathroom.find().sort({createdAt: -1}).skip(skip).limit(limit).populate("user", "username profileImage"); 

        res.json({
            bathrooms, 
            currentPage: page, 
            totalBathroom, 
            totalPages: Math.ceil(totalBathroom / limit)});
    } catch (error) {
        console.log("Error in get all bathroom route", error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const bathroom = await Bathroom.findById(req.params.id);
        
        if (!bathroom){
            return res.status(404).json({message: "Bathroom not found."});
        }
        if (bathroom.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Unauthorized"});
        }

        const Review = mongoose.model('Review');
        await Review.deleteMany({ bathroom: req.params.id }); 

        if (bathroom.image && bathroom.image.includes("cloudinary")){
            try {
                const publicId = bathroom.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Error deleting image from Cloudinary", deleteError);
            }
        }

        await bathroom.deleteOne();
        res.json({message: "Bathroom deleted successfully"})
    } catch (error) {
        console.log("Error deleting bathroom.", error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.get('/user', protectRoute, async (req, res) => {
    try {
        const userId = req.user.id; 

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        const userBathrooms = await Bathroom.find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();

        res.status(200).json(userBathrooms);

    } catch (error) {
        console.error(`Error fetching user bathrooms: ${error.message}`);
        res.status(500).json({ message: 'Server error while fetching user locations.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const bathroom = await Bathroom.findById(req.params.id)
            .populate('user', 'username'); 

        if (!bathroom) {
            return res.status(404).json({ message: 'Bathroom not found.' });
        }
        
        res.status(200).json(bathroom); 

    } catch (error) {
        console.error("Error fetching single bathroom:", error);
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Bathroom ID format.' });
        }
        res.status(500).json({ message: 'Internal server error.' });    
    }
});

module.exports = router;