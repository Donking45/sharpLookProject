const nodemailer = require("nodemailer")




/* Register User and Send OTP
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });


        if (user) return res.status(400).json({ message: 'User already exists' });


        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);


        user = new User({ name, email, password, otp, otpExpiry });
        await user.save();


        await transporter.sendMail({
            from: 'afnantariq715@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`
        });


        res.status(201).json({ message: 'User registered. Please verify OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};
*/


        
/* Dashboard (Protected Route)
exports.dashboard = async (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.session.user.name}` });
};


// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const sendEmail = async (email) => {
  try {
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
      }
    });


    const otp = generateOTP(); // Now this won't conflict with any parameter
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Optional usage

    const mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`
    };


    await mailTransport.sendMail(mailDetails);
    
    return { otp, otpExpiry }; // return it so it can be stored or verified later


  } catch (error) {
    console.log(error);
    throw error; // propagate the error
  }
};


const validEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


module.exports = {
    sendEmail,
    validEmail,
}*/



const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    const mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject,
      text: message,
    };


    await mailTransport.sendMail(mailDetails);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const validEmail = (email) => {
  const re =
    /^(([^<>()[\\.,;:\s@"]+(\.[^<>()[\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};


module.exports = {
  sendEmail,
  validEmail,
};
