const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for individual rooms/listings within a PG
const pgPostSchema = new Schema({
    roommates_required: {
        type: Number,
        required: true,
    },
    roomImage: {
        type: String, // URL to the image
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PGPost', pgPostSchema);