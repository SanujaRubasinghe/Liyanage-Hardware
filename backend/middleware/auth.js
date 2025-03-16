const jwt = require('jsonwebtoken')
require("dotenv").config()

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log(token)

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        req.user = decoded;
        next(); 
    } catch (err) {
        console.error("Token error: ",err)
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authenticateToken