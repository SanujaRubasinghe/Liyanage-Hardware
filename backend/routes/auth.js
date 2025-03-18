const express = require("express")
const jwt = require("jsonwebtoken")
const pool = require("../db")
const authenticateToken = require("../middleware/auth")
const router = express.Router()
require("dotenv").config()

router.post("/login", async (req, res) => {
    const {username, password} = req.body
    try {
        const [rows] = await pool.query("select * from usrtbl where usrname=?", [username])
        if (rows[0].length === 0) {
            return res.status(400).json({message: "User not found"})
        }

        //change this to bcrypt.compare after hashing the passwords
        const isPasswordValid = rows[0].usrpassword === password
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: "5h"})

        res.cookie("token", token, {httpOnly: true, secure: false, sameSite: "lax"})
        return res.json({message: "Login Successful", usertoken: token })
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("token").json({message: "Logged out"})
})

router.get("/profile", authenticateToken, async (req, res) => {
    const [rows] = await pool.query("select id, usrname, usremail from usrtbl where id=?", [req.user.id])
    res.json(rows[0])
})

module.exports = router