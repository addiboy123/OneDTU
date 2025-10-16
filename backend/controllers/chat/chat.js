// controllers/chatController.js

// Safe model loader to support both CJS and ESM-style exports
const loadModel = (path) => {
  const mod = require(path);
  return mod?.Chat || mod?.default || mod;
};

const Chat = loadModel("../../models/Chat/chat.model");
const User = require("../../models/User.js");


// @desc    Access or create a chat between two users
// @route   GET /api/chat/access
// @access  Private
exports.accessChat = async (req, res) => {
  // authenticated user available on req.user (set by authentication middleware)
  const authUserId = req.user?.userId;
  const { phoneNumberOfReceivingUser } = req.query;
  if (!authUserId || !phoneNumberOfReceivingUser) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const currentUser = await User.findById(authUserId);
    const receivingUser = await User.findOne({ phoneNumber: phoneNumberOfReceivingUser });

    if (!currentUser || !receivingUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    let chat = await Chat.findOne({
      members: { $all: [currentUser._id, receivingUser._id] },
      $expr: { $eq: [ { $size: "$members" }, 2 ] }
    })
      .populate("members", "name profile_photo_url phoneNumber")
      .populate({ path: 'lastMessage', populate: { path: 'senderId', select: 'name profile_photo_url _id' } });

    if (chat) {
      return res.status(200).json(chat);
    }

    // Create new chat if it doesn't exist
    const newChat = await Chat.create({
      chatType: 'private',
      members: [currentUser._id, receivingUser._id],
    });

    const fullChat = await Chat.findById(newChat._id).populate("members", "name profile_photo_url phoneNumber");
    return res.status(201).json(fullChat);

  } catch (error) {
    console.error("Chat creation failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// @desc    Get all chats of the logged-in user
// @route   GET /api/chat
// @access  Private
exports.fetchUserChats = async (req, res) => {
  const authUserId = req.user?.userId;
  if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const chats = await Chat.find({ members: authUserId })
      .populate("members", "name profile_photo_url phoneNumber")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "name profile_photo_url"
        }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to load chats" });
  }
};


