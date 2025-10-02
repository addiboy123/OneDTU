const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for Societies and Clubs
const societySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    contactDetails: {
        type: String,
        required: false
    },
    images: [{
        type: String // URLs to images for the society (e.g., logo, cover photo)
    }],
    achievements: {
        type: String,
        required: false // As per your diagram
    },
    // This creates a one-to-many relationship between a society and its posts
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
