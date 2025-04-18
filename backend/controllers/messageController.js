const twilio = require('twilio')
require('dotenv').config()

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

exports.sendWhatsAppMessage = async (req, res) => {
    const {to, message} = req.body

    if (!to || !message) {
        return res.status(400).json({error: "Recipient number and message are required"})
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: "whatsapp:+14155238886",
            to: "whatsapp:+94707181470"
        })
        res.json({success: true, messageId: response.sid})
    } catch(err) {
        console.error("Error sending WhatsApp message: ", err)
        res.status(500).json({error: err.message})
    }
}


