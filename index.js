const express  = require("express")
const mongoose = require("mongoose")
const routes = require('./routes/index.js')
const cors = require('cors')

require('dotenv').config(); 


const app = express()
app.use(cors())

// Middleware
app.use(express.json())

// Routes
app.use('/api/v1/', routes);




const PORT = process.env.PORT || 7001

const MONGO_URL = process.env.MONGO_URL;



mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("MongoDb is connected successfully")
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
})
