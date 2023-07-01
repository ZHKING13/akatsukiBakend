const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const { DB_CON_STRING } = process.env

module.exports = () => {
    // mogoose.connect("mongodb://localhost/ecommerce")
    mongoose.connect(`${DB_CON_STRING}`)
        .then(() => console.log('DB Connection Successfull'))
        .catch(err => console.log(err.message))
}