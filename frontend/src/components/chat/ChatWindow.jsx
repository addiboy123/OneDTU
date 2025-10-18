import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import api from "../../api/interceptor";
import socket from "../../lib/socket";

// ✅ UX: Skeleton component for a better loading experience
const MessageSkeleton = ({ isOwn }) => (
  <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
    <div className={`w-2/5 h-10 rounded-2xl ${isOwn ? "bg-blue-200" : "bg-gray-200"}`}></div>
  </div>
);

// ✅ RESPONSIVE: Accept the `onBack` function in props
export default function ChatWindow({ selectedChat, currentUserId, setRefreshChats, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  // ✅ UX: Added loading state
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/chat/messages/${selectedChat._id}`);
        setMessages(res.data.messages || []);
        await api.patch(`/chat/mark-read/${selectedChat._id}`);
        setRefreshChats((prev) => !prev);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat?._id, setRefreshChats]);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const chatId = selectedChat._id;
    socket.emit("join chat", chatId);

    const handleNewMessage = (newMessage) => {
      if (newMessage.chat._id === chatId) {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
        if (newMessage.senderId?._id !== currentUserId) {
          api.patch(`/chat/mark-read/${chatId}`).then(() => setRefreshChats((prev) => !prev));
        }
      }
    };

    socket.on("message received", handleNewMessage);

    return () => {
      socket.off("message received", handleNewMessage);
      socket.emit("leave chat", chatId);
    };
  }, [selectedChat?._id, currentUserId, setRefreshChats]);

  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;
    try {
      const res = await api.post(`/chat/message`, {
        chatId: selectedChat._id,
        senderType: 'user',
        messageType: 'text',
        messageText: input,
      });
      const created = res.data.message;
      setMessages((prev) => [...prev, created]);
      socket.emit("new message", { ...created, chat: { _id: selectedChat._id } });
      setInput("");
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    }
  };

  const otherUser = selectedChat?.members?.find((user) => user._id !== currentUserId);

  // ✅ REFACTORED: Parent component now handles the placeholder for large screens
  if (!selectedChat) {
    return null;
  }

  return (
    // ✅ REFACTORED: Layout now fills available space instead of having a fixed width
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center bg-white px-4 py-3 shadow-sm border-b sticky top-0 z-10">
        {/* ✅ RESPONSIVE: Back button, hidden on large screens */}
        <button onClick={onBack} className="lg:hidden mr-3 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <img
          className="w-10 h-10 rounded-full object-cover mr-3"
          src={otherUser?.profile_photo_url || "/placeholder.svg"}
          alt={otherUser?.name}
        />
        <h2 className="text-lg font-semibold text-gray-900">
          {otherUser?.name || "Chat"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {loading ? (
          <>
            <MessageSkeleton />
            <MessageSkeleton isOwn />
            <MessageSkeleton />
          </>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderId?._id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-2xl shadow-md text-sm ${
                  msg.senderId?._id === currentUserId
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border"
                }`}
              >
                {msg.messageType === 'text' ? msg.messageText : '[Attachment]'}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 sticky bottom-0 z-10 flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shrink-0"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}