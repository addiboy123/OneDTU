import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatType: { 
    type: String, 
    enum: ['private', 'group', 'ai'],
    required: true 
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  chatName: String,
  lastMessageAt: Date,
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);