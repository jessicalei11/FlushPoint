const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protectRoute = async (req, res, next) => {
    try {
        //Retrieves token
        const token = req.header("Authorization").replace("Bearer ", "");

        if (!token){
            return res.status(401).json({message: "No authentication token, access denied"});
        }

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Finds User
        const user = await User.findById(decoded.userId).select("-password");

        if (!user){
            return res.status(401).json({message: "Token is not valid."})
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Authenication error:", error.message);
        res.status(401).json({message: "Token is not valid."})
    }
}

module.exports = protectRoute;