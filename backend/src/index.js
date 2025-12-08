require("dotenv/config"); 

const express = require("express");
const cors = require("cors");
const job = require("./lib/cron.js"); 
const cloudinary = require("./lib/cloudinary.js");

const authRoutes = require("./routes/authRoutes.js");
const bathroomRoutes = require("./routes/bathroomRoutes.js");
const { connectDB } = require("./lib/db.js");
const reviewRoutes = require('./routes/reviewRoutes');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/bathrooms", bathroomRoutes); 
app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});