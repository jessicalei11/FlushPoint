const express = require("express");
require("dotenv/config");

const authRoutes = require("./routes/authRoutes.js");
const bathroomRoutes = require("./routes/bathroomRoutes.js");
const { connectDB } = require("./lib/db.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bathrooms", bathroomRoutes);

app.listen(PORT, () => {
    console.log(`'Server running on port ${PORT}`);
    connectDB();
});