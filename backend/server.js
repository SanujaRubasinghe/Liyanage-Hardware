const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth")
const bodyParser = require("body-parser")
require("dotenv").config()

const app = express()
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})