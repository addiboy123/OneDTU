const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for individual rooms/listings within a PG
const pgPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    roommates_required: {
        type: Number,
        required: true,
    },
    roomImage: {
        type: String, // URL to the image
        required: true
    },
    // Add this field to link the room to its main PG
    parentPG: {
        type: Schema.Types.ObjectId,
        ref: 'PG',
        required: true,
    },
    // Add this field to track the creator for security
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This should match the name of your User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PGPost', pgPostSchema);
