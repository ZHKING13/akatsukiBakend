//simple user model with mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    totalEmargements: {
        type: Number,
        default: 0
    },
    lastEmargement: Date,
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;