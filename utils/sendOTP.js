const twilio = require('twilio');
const userModel = require('../models/userModel');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken)

const sendOTP = async (res, req) => {
    try {
        const {phoneNumber} = req.body

        const otp =  Math.floor(1000 + Math.random() * 9000).toString();

        const cDate = new Date();

        await userModel.findOneAndUpdate(
            {phoneNumber},
            { phoneOTP, phoneOTPExpires: new Date(cDate.getTime())},
            {upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            to: phoneNumber,
            from: twilioPhoneNumber
        })
       
        return res.status(200).json({
            success: true,
            msg: 'OTP sent successfully'
        })
      
    } catch(error) {
        console.error("Twilio SMS error:", error);
        throw error
    }

}

module.exports = {sendOTP};
