const express = require('express')
const router = express.Router()
const {uploadComplaintImage, createComplaint} = require('../controllers/customerFeedbackController')


router.post('/create-complaint',uploadComplaintImage, createComplaint)

module.exports = router