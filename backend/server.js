const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/productRoutes")
const messageRoutes = require("./routes/messageRoutes")
const locationRoutes = require("./routes/userLocationRoutes")
const bodyParser = require("body-parser")
require("dotenv").config()

const app = express()
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/location", locationRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})