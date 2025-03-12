const twilio = require("twilio")
require("dotenv").config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

async function createMessage(number) {
    const message = await client.messages.create({
        body: "WhatsApp ekata wena seen ekak balanna wei wage",
        from: process.env.TWILIO_PHONE_NUMBER, 
        to: number,
    })

    console.log(message.body)
}

