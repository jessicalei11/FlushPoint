// backend/src/index.js (Final Corrected Version)

// 1. CRITICAL: Load environment variables FIRST.
require("dotenv/config"); 

const express = require("express");
const cors = require("cors");
const job = require("./lib/cron.js"); 
const cloudinary = require("./lib/cloudinary.js"); // Import Cloudinary module

const authRoutes = require("./routes/authRoutes.js");
const bathroomRoutes = require("./routes/bathroomRoutes.js");
const { connectDB } = require("./lib/db.js");

// 2. CONFIGURE CLOUDINARY HERE: Immediately after dotenv loads.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
// 3. FIX: Increase JSON payload limit to prevent HTTP 413 (Payload Too Large)
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/bathrooms", bathroomRoutes); // Correctly using /bathrooms

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});