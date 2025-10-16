const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const chatController = require("../controllers/chat/chat");
const messageController = require("../controllers/chat/message");

// Create or access a chat between two users (authenticated)
router.get("/access-chat", auth, chatController.accessChat);

// Get all chats for the authenticated user
router.get("/fetch-chats", auth, chatController.fetchUserChats);

// Get all messages in a chat (must be a member)
router.get("/messages/:chatId", auth, messageController.getAllMessages);

// Send a message in a chat
router.post("/message", auth, messageController.sendMessage);

// Mark all messages in a chat as read for the authenticated user
router.patch("/mark-read/:chatId", auth, messageController.markMessagesAsRead);

module.exports = router;
