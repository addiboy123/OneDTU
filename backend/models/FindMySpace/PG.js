const mongoose = require('mongoose');
const { Schema } = mongoose;


// Schema for the main PG listing
const pgSchema = new Schema({
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
        type: String // URLs to general images of the PG
    }],
    pricePerPerson: {
        type: Number,
        required: true
    },
    mess_fee: {
        type: Number,
        required: true
    },
    googleMapLink: {
        type: String,
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
    // This creates a one-to-many relationship between a PG and its posts (rooms)
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'PGPost'
    }]
}, { timestamps: true });

module.exports = mongoose.model('PG', pgSchema);
