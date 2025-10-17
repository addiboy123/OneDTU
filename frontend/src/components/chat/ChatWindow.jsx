import { useEffect, useRef, useState } from "react";
import api from "../../api/interceptor";
import socket from "../../lib/socket";

export default function ChatWindow({ selectedChat, currentUserId, setRefreshChats }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${selectedChat._id}`);
        // API returns { messages: [...] }
        setMessages(res.data.messages || []);

        // mark read (server uses authenticated user, no body required)
        await api.patch(`/chat/mark-read/${selectedChat._id}`);

        setRefreshChats(prev => !prev);
        setTimeout(scrollToBottom, 100); // ensure DOM is ready
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages.");
      }
    };

    fetchMessages();
  }, [selectedChat?._id]);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const chatId = selectedChat._id;
    socket.emit("join chat", chatId);
    console.log("📡 Joined chat room:", chatId);

    const handleNewMessage = (newMessage) => {
      if (newMessage.chat._id === chatId) {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();

        if (newMessage.senderId?._id !== currentUserId) {
          api.patch(`/chat/mark-read/${chatId}`).then(() => setRefreshChats(prev => !prev));
        }
      }
    };

    socket.on("message received", handleNewMessage);

    return () => {
      socket.off("message received", handleNewMessage);
      socket.emit("leave chat", chatId);
    };
  }, [selectedChat?._id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      // API expects: { chatId, senderType (user), messageType, messageText }
      const res = await api.post(`/chat/message`, {
        chatId: selectedChat._id,
        senderType: 'user',
        messageType: 'text',
        messageText: input,
      });

  const created = res.data.message;
  setMessages((prev) => [...prev, created]);
  // ensure emitted message contains chat._id for server routing
  socket.emit("new message", { ...created, chat: { _id: selectedChat._id } });
      setInput("");
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    }
  };

  const otherUser = selectedChat?.members?.find(
    (user) => user._id !== currentUserId
  );

  if (!selectedChat?._id) {
    return (
      <div className="w-3/4 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col w-3/4 h-full relative bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm border-b sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">
          {otherUser?.fullName || "Chat"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId?._id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-md text-sm ${
                msg.senderId?._id === currentUserId
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border"
              }`}
            >
              {msg.messageType === 'text' ? msg.messageText : '[Attachment]'}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-200 border-t border-gray-200 sticky bottom-0 z-10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
