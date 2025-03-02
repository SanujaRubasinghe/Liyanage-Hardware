require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const users = [{username: "admin", password: 1234}]
const SECRET_KEY = process.env.JWT_SECRET_KEY

const verifytoken = (req, res, next) => {
    const token = req.headers['authorization']
    if(!token) return res.status(403).json({message: "Token required"})

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({message: "Invalid token"})
        req.user = user
        next()
    })
}

app.post("/login", (req, res) => {
    const {username, password} = req.body
    const user = users.find((u) => u.username === username)
    console.log(`user-name: ${username} | password: ${password}`)

    if (!user || (user.password !== password)) {
        return res.status(401).json({message: "Invalid credentials"})
    }

    const token = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: "1h"})

    res.json({token})
})

app.listen(5000, () => {
    console.log("Server started at port 5000")
})