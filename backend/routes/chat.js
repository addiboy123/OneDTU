const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const messageController = require("../controllers/messageController");

// Create or access a chat between two users
router.get("/access-chat", chatController.accessChat);

// Get all chats for a user (expects userId in query)
router.get("/fetch-chats", chatController.fetchUserChats);

// Get all messages in a chat
router.get("/messages/:chatId", messageController.getAllMessages);

// Send a message in a chat
router.post("/message", messageController.sendMessage);

// Mark all messages in a chat as read for a user
router.patch("/mark-read/:chatId", messageController.markMessagesAsRead);

module.exports = router;
