const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for standalone Flat listings
const flatPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String // URLs to images of the flat
    }],
    pricePerPerson: {
        type: Number,
        required: true
    },
    distanceFromDtu: {
        type: Number,
        required: true
    },
    electricityRate: {
        type: Number,
        default: 0
    },
    googleMapLink: {
        type: String
    },
    // Add this field to track the creator of the post
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users', // This should match the name of your User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('FlatPost', flatPostSchema);
