const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : { type: String},
    email : { type: String},
    password : { type: String},
    isVerified: { type: Boolean, default: false },
    passwordResetToken : {type: String},
    passwordResetExpires : {type: Date},
    role : { type: String, default: 'customer'},
    added_by: {type: String, default: 'owner'},
}, {timestamps: true})

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
})

module.exports = mongoose.model('User',userSchema)