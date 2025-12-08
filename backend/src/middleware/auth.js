const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protectRoute = async (req, res, next) => {
    let token;

    const authHeader = req.header("Authorization");
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, access denied." });
    }

    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        
        // 4. Find the User
        if (!user) {
            return res.status(401).json({ message: "Token is not valid." });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: "Not authorized, token failed." });
    }
}

module.exports = protectRoute;