const express = require('express')
const router = express.Router()
const {uploadComplaintImage, createComplaint, createReview, getAllReviews} = require('../controllers/customerFeedbackController')


router.post('/create-complaint',uploadComplaintImage, createComplaint)
router.post('/create-review', createReview)
router.get('/get-all-reviews', getAllReviews)

module.exports = router