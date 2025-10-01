const mongoose = require('mongoose');
const { Schema } = mongoose;

const societyAdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, // Remember to hash this!
        required: true
    },
    // This links an admin to the society they manage
    society: {
        type: Schema.Types.ObjectId,
        ref: 'Society',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SocietyAdmin', societyAdminSchema);
