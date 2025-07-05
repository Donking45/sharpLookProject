const authRoute = require('./authRoute')
const vendorRoute = require('./vendorRoute')
const bookingRoute = require('./bookingRoute')
const categoryRoute = require('./categoryRoute')



const routes = [
    authRoute,
    vendorRoute,
    bookingRoute,
    categoryRoute
]

module.exports = routes