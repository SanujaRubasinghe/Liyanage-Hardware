const express = require('express')
const router = express.Router()
const {sendWhatsAppMessage} = require('../controllers/messageController')

router.post('/send-message', sendWhatsAppMessage)

module.exports = router