const mongoose = require('mongoose');
const { Schema } = mongoose;
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String // URLs to images for the post
    }],
    likes: {
        type: Number,
        default: 0
    },
    // A post can be in one of the following categories
    postCategory: {
        type: String,
        enum: ['recruitment', 'events', 'gallery'],
        required: true
    },
    // This creates a one-to-many relationship between a post and its comments
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
