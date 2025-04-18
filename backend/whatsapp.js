const twilio = require("twilio")
require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

async function createMessage(order) {
    const message = await client.messages.create({
        body: order,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+94707181470"
    })

    console.log(message.body)
}


module.exports = createMessage