const pool = require("../db")
const path = require("path")
const fs = require("fs")
const multer = require("multer")

const uploadPath = path.join(__dirname, "../uploads/private/complaint_imgs")
if (!fs.existsSync(uploadPath)) {
    fs.mkdir(uploadPath, {recursive: true})
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function(req, file, cb) {
        const timestamp = Date.now()
        const ext = path.extname(file.originalname)
        cb(null, `temp-${timestamp}${ext}`)
    },
})

const upload = multer({storage})
const uploadComplaintImage = upload.single("image")

const createComplaint = async (req, res) => {
    const {fullName, email, invoiceNumber, repCode, contactNumber, branch, message} = req.body
    let finaleImageFilename = null

    if (req.file) {
        const originalPath = path.join(uploadPath, req.file.filename)
        const ext = path.extname(req.file.originalname)
        const safeInvoice = invoiceNumber.replace('/\s+g', '-').toLowerCase()
        const newFileName = `${safeInvoice}${ext}`
        const newPath = path.join(uploadPath, newFileName)

        try {
            fs.renameSync(originalPath, newPath)
            finaleImageFilename = newFileName
        } catch (err) {
            console.error("Failed to rename image: ", err.message)
            return res.status(500).json({error: "Error processing image"})
        }
    
    }

    
    try {
        const query = `insert into customer_complaints(full_name, email, invoice_number, rep_code, contact_number,
                       branch, message, image_url)
                       values(?,?,?,?,?,?,?,?)`

        const values = [fullName, email, invoiceNumber, repCode, contactNumber, branch, message, finaleImageFilename]

        const results = await pool.execute(query, values)
        res.status(201).json({message: "Complaint recorded sucessfully"})
            
    } catch (err) {
        res.status(500).json({err: "Internal server error"})
        console.log(err.message)
    }
}

const createReview = async (req, res) => {
    const {rating, profilePicture, comment, userName} = req.body

    try {
        const query = `insert into customer_feedback(rating, comment, profile_picture_url, user_name)
                       values(?,?,?,?)`

        const values = [rating, comment, profilePicture, userName]

        const results = await pool.execute(query, values)
        res.status(201).json({message: "Review recorded successfully"})

    } catch (error) {
        res.status(500).json({err: "Internal server error"})
        console.log(error)
    }
}

const getAllReviews = async (req, res) => {
    try {
        const [rows] = await pool.execute('select * from customer_feedback')
        res.json(rows)
    } catch (error) {
        res.status(500).json({err: "Internal server error. Failed to fetch reviews"})
        console.log(error)
    }
}

module.exports = {
    uploadComplaintImage,
    createComplaint,
    createReview,
    getAllReviews
}