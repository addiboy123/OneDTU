const loadModel = (path) => {
  const mod = require(path);
  return mod?.Message || mod?.Chat || mod?.default || mod;
};

const Message = loadModel("../../models/Chat/message.model");
const Chat = loadModel("../../models/Chat/chat.model");

// Fetch all messages from a chat (GET /api/v1/message/:chatId)
exports.getAllMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) return res.status(400).json({ message: "chatId required" });

    // Check chat exists
    const chatExists = await Chat.exists({ _id: chatId });
    if (!chatExists) return res.status(404).json({ message: "Chat not found" });

    // Ensure requester is a member of the chat
    const authUserId = req.user?.userId;
    if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
    const isMember = await Chat.exists({ _id: chatId, members: authUserId });
    if (!isMember) return res.status(403).json({ message: 'Forbidden' });

    // Messages reference `chatId` and `senderId` per model
    const messages = await Message.find({ chatId })
      .populate("senderId", "name profile_photo_url _id")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Internal server error");
  }
};

// Send a new message (POST /api/v1/message/)
exports.sendMessage = async (req, res) => {
  const { chatId, senderType: incomingSenderType, senderId: incomingSenderId, messageType, messageText, attachmentUrl } = req.body;
  const authUserId = req.user?.userId;

  if (!chatId || !incomingSenderType || !messageType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // If senderType is 'user', ensure senderId is the authenticated user
    const senderType = incomingSenderType;
    let senderId = incomingSenderId;
    if (senderType === 'user') {
      if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
      senderId = authUserId;
    }

    const payload = { chatId, senderType, senderId, messageType };
    if (messageType === 'text') payload.messageText = messageText;
    else payload.attachmentUrl = attachmentUrl;

    let newMessage = await Message.create(payload);

    // push message into chat.messages and update lastMessage/lastMessageAt
    chat.messages = chat.messages || [];
    chat.messages.push(newMessage._id);
    chat.lastMessage = newMessage._id;
    chat.lastMessageAt = newMessage.createdAt || new Date();
    await chat.save();

    // populate senderId if present
    newMessage = await Message.findById(newMessage._id).populate('senderId', 'name profile_photo_url _id');

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Internal server error');
  }
};

// Mark all unread messages in a chat as read (for current user)
exports.markMessagesAsRead = async (req, res) => {
  const { chatId } = req.params;
  const authUserId = req.user?.userId;

  if (!chatId || !authUserId) return res.status(400).json({ error: 'chatId and authenticated user are required' });

  try {
    const result = await Message.updateMany(
      { chatId, senderId: { $ne: authUserId }, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, updatedCount: result.modifiedCount ?? result.nModified ?? 0 });
  } catch (err) {
    console.error('Failed to mark messages as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
