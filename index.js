const express  = require("express")
const mongoose = require("mongoose")
const routes = require('./routes')
const cors = require('cors')
const upload = require('./utils/cloudinary')

require('dotenv').config(); 




const app = express()
app.use(cors())

// Middleware
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.post("/upload", (req, res) => {
  upload(req.body.image)
     .then((url) => res.send(url))
     .catch((err) => res.status(500).send(err))
})


// Routes
routes.forEach(route => {
  app.use('/api/v1', route);
});


const PORT = process.env.PORT || 7001

const MONGO_URL = process.env.MONGO_URL;



mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("MongoDb is connected successfully")
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
})
