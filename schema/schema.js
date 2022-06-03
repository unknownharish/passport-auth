const mongoose = require('mongoose');

const schema = mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },



})

exports.model = mongoose.model('userlogin', schema)