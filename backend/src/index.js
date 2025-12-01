const express = require("express");
const cors = require("cors");
require("dotenv/config");
const jobModule = require("./lib/cron.js");

const job = jobModule.default;
const authRoutes = require("./routes/authRoutes.js");
const bathroomRoutes = require("./routes/bathroomRoutes.js");
const { connectDB } = require("./lib/db.js");

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/bathrooms", bathroomRoutes);

app.listen(PORT, () => {
    console.log(`'Server running on port ${PORT}`);
    connectDB();
});