const authRoute = require('./authRoute')
const vendorRoute = require('./vendorRoute')
const bookingRoute = require('./bookingRoute')
const paystackRoute = require('./paystackRoute')
const productRoute = require('./productRoute')
const orderRoute = require('./orderRoute')
const categoryRoute = require('./categoryRoute')
const transactionRoute = require('./transactionRoute')
const walletRoute = require('./walletRoute')




const routes = [
    authRoute,
    categoryRoute,
    vendorRoute,
    bookingRoute,
    paystackRoute,
    productRoute,
    orderRoute,
    transactionRoute,
    walletRoute
]

module.exports = routes