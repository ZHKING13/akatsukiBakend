//simple user model with mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({

    email: {
        type: String,
        require: true,
        unique: true
    },
    otp: String,
    creatAt: Date,
    expirAt: Date,
})

const otpModel = mongoose.model('otp', otpSchema);
module.exports = otpModel;