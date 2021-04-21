const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    hotelname : { type: String},
    item : { type: String},
    price : { type: Number},
    ingredients : { type: String},
}, {timestamps: true})

module.exports = mongoose.model('Hotel',hotelSchema)