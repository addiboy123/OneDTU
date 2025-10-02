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

const bcrypt = require('bcryptjs');

// Hash password before saving
societyAdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// method to compare password
societyAdminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('SocietyAdmin', societyAdminSchema);
