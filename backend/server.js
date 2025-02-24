const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db'
})

db.connect((err) => {
    if(err) {
        console.error("Database connection failed: ", err.message)
    } else {
        console.log('Connected to MySQL Database')
    }
})

app.post('/login', (req, res) => {
    const {username, password} = req.body

    db.query("select * from users where user_name= ?", [username], async (err, result) => {
        if (err) return res.status(500).json({error: 'Database error'})
        if (result.length === 0) return res.status(401).json({error: 'User not found'})

        const user = result[0]
        const passwordMatch = password == user.user_password ? true : false

        if (!passwordMatch) return res.status(401).json({error: "Incorrect Password"})

        const token = jwt.sign({id: user.user_id}, 'secretkey', {expiresIn: '1h'})
        res.json({message: 'Login successful', token})
    })
})

app.listen(5000, () => {
    console.log('Server listening on port 5000')
})