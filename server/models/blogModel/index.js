const mongoose = require('mongoose')

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    ],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    bookmarks: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
}, { timestamps: true })

const Blog = mongoose.model('Blog', BlogSchema)
module.exports = Blog