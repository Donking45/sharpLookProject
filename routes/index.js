const authRoute = require('./authRoute')
const vendorRoute = require('./vendorRoute')
const bookingRoute = require('./bookingRoute')
const paystackRoute = require('./paystackRoute')
const clientRoute = require('./clientRoute')




const routes = [
    authRoute,
    vendorRoute,
    bookingRoute,
    paystackRoute,
    clientRoute
]

module.exports = routes