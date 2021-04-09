const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : { type: String},
    email : { type: String},
    password : { type: String},
    role : { type: String, default: 'customer'}
}, {timestamps: true})

module.exports = mongoose.model('User',userSchema)