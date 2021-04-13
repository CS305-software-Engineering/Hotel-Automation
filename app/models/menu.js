const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    hotel : { type: String},                            //Auto Fill
    dish : { type: String, default: 'item'},
    description : { type: String},
    ingredients : { type: String, default: 'condiment'}
}, {timestamps: true})

module.exports = mongoose.model('Menu',menuSchema)