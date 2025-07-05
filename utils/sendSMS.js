const twilio = require('twilio')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken)

const sendSMS = async (to, message) => {
    try {
       const response = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: to
       })
       console.log("SMS sent:", response.sid)
       return response;
    } catch(error) {
        console.error("Twilio SMS error:", error);
        throw error
    }

}

module.exports = {sendSMS};
