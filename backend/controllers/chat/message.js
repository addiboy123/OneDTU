const Message = require("../models/message");
const Chat = require("../models/chat");

// Fetch all messages from a chat (GET /api/v1/message/:chatId)
exports.getAllMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    console.log("getAllMessages called with chatId:", chatId);
    // Optional: Check if chat exists
    const chatExists = await Chat.exists({ _id: chatId });
    if (!chatExists) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "fullName _id")
      .populate("chat")
      .sort({ createdAt: 1 }); // sort chronologically

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Internal server error");
  }
};

// Send a new message (POST /api/v1/message/)
exports.sendMessage = async (req, res) => {
  const { content, chatId, senderId } = req.body;

  console.log("sendMessage called with body:", req.body);


  if (!content || !chatId || !senderId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Optional: validate chat existence
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    let newMessage = await Message.create({
      sender: senderId,
      content,
      chat: chatId,
    });

    // Populate sender and chat fields
    newMessage = await newMessage.populate("sender", "fullName _id");
    newMessage = await newMessage.populate("chat");

    // Update latest message in chat
    chat.latestMessage = newMessage._id;
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Internal server error");
  }
};

// Mark all unread messages in a chat as read (for current user)
exports.markMessagesAsRead = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ error: "chatId and userId are required" });
  }

  try {
    const result = await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Failed to mark messages as read:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
