const authRoute = require('./authRoute')
const vendorRoute = require('./routes/vendorRoute')



const routes = [
    authRoute,
    vendorRoute
    
]

module.exports = routes