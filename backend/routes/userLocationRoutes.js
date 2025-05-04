const express = require('express')
const router = express.Router()
const {getDeliveryCharges} = require("../controllers/userLocationController")

router.post('/delivery-charges', getDeliveryCharges)

module.exports = router