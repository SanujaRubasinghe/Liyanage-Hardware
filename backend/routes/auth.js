const express = require("express")
const jwt = require("jsonwebtoken")
const pool = require("../db")
const authenticateToken = require("../middleware/auth")
const router = express.Router()
require("dotenv").config()

router.post("/login", async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await pool.query("select * from users where username=$1", [username])
        if (user.rows.length === 0) {
            return res.status(400).json({message: "User not found"})
        }

        //change this to bcrypt.compare after hashing the passwords
        const isPasswordValid = user.rows[0].password === password
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id: user.rows[0].id}, process.env.JWT_KEY, {expiresIn: "1h"})

        res.cookie("token", token, {httpOnly: true, secure: false, sameSite: "lax"})
        return res.json({message: "Login Successful"})
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("token").json({message: "Logged out"})
})

router.get("/profile", authenticateToken, async (req, res) => {
    const user = await pool.query("select id, username, email from users where id=$1", [req.user.id])
    res.json(user.rows[0])
})

module.exports = router