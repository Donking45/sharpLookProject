const ServiceCategory = require('../models/serviceCategoryModel')
const mongoose = require('mongoose')

const categories = [
    {name: "Makeup", description: "Makeup artists and services"},
    {name: "Nails", description: "Nail techs, manicure, pedicure"},
    {name: "Hair", description: "Hair stylists, barbers, braids"}
];

async function seed(){
    mongoose.connect(process.env.MONGO_URL);

    await ServiceCategory.insertMany(categories);
    console.log("Seeded categories");
    process.exit()
}

seed();