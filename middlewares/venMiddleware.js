const jwt = require('jsonwebtoken');
const Vendor = require("../models/vendorModel")





const validateRegister = (req, res, next)=>{


    const { email, password, firstName, lastName, role } = req.body


    const errors = []


    if(!email){
        errors.push("Please add your email")
    }


    if(!password){
        errors.push("Please add your password")
    }


    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }


    next()


}


const vendorAuth = async (req, res, next)=>{
  try {
    const token = req.header("Authorization")

    if(!token){
        return res.status(401).json({message: "Please login!"})
    }

    const splitToken = token.split(" ")

    const realToken = splitToken[1]

    const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)

    if(!decoded){
        return res.status(401).json({message: "Please login!"})
    }

    const vendor = await Vendor.findById(decoded.id)

    if(!vendor){
        return res.status(404).json({message: "Vendor account does not exist"})
    }


    req.vendor = vendor

    next()
  } catch (err) {
    res.status(401).json({ message: "Unauthorized"})
  }
    
}


module.exports = { validateRegister, vendorAuth};
