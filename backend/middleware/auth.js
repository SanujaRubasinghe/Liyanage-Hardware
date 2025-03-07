const jwt = require('jsonwebtoken')
require("dotenv").config()

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({message: "Unauthorized"})
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({message: "Invalid Token"})
        }
        req.user = user
        next()
    })
}

module.exports = authenticateToken