const authRoute = require('./authRoute')
const vendorRoute = require('./vendorRoute')
const bookingRoute = require('./bookingRoute')




const routes = [
    authRoute,
    vendorRoute,
    bookingRoute
]

module.exports = routes