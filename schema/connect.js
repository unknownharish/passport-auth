const mongoose = require('mongoose');
require('dotenv').config({ path: '../process.env' })


exports.connect = async() => {
    await mongoose.connect(process.env.url, (err) => {
        err ? console.log(err) : console.log('DB connected sucessfully')
    })


}