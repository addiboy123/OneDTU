const mongoose = require('mongoose');
const { Schema } = mongoose;
// Schema for comments on a post
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    // This links a comment to a specific user (assuming you have a User model)
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('Comment', commentSchema);