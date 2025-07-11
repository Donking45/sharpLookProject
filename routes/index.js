const authRoute = require('./authRoute')
const vendorRoute = require('./vendorRoute')
const bookingRoute = require('./bookingRoute')
const paystackRoute = require('./paystackRoute')
const productRoute = require('./productRoute')
const orderRoute = require('./orderRoute')




const routes = [
    authRoute,
    vendorRoute,
    bookingRoute,
    paystackRoute,
    productRoute,
    orderRoute
]

module.exports = routes