const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio:{
        type:String
    },
    password: {
        type: String,
        required : true
    },
    savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]  // <-- add this

},{timestamps: true})

const User = mongoose.model('User',UserSchema)
module.exports = User