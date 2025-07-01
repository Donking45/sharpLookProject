require('dotenv').config(); // Ensure dotenv is loaded
const mongoose = require('mongoose');


const USERS = []

function getUserByEmail(email) {
    return USERS.find(user => user.email === email)
}

function getUserById(id) {
    return USERS.find(user => user.id === id)
}

function createUser(id, email, passkey) {
     USERS.push({ id, email, passkey })
}

function updateUserCounter(id, counter) {
    const user = USERS.find(user => user.id === id)
    user.passkey.counter = counter
}



/*const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI; // Ensure it's fetched correctly
        if (!mongoURI) throw new Error("MONGO_URI is missing");


        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err.message);
        process.exit(1);
    }
};*/


module.exports = {
    //connectDB,
    USERS,
    getUserByEmail,
    getUserById,
    createUser,
    updateUserCounter
};
