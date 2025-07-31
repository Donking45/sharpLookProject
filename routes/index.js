const authRoute = require('./authRoute')
const vendorRoute = require('./vendorRoute')
const bookingRoute = require('./bookingRoute')
const paystackRoute = require('./paystackRoute')
const productRoute = require('./productRoute')
const orderRoute = require('./orderRoute')
const categoryRoute = require('./categoryRoute')




const routes = [
    authRoute,
    categoryRoute,
    vendorRoute,
    bookingRoute,
    paystackRoute,
    productRoute,
    orderRoute
]

module.exports = routes