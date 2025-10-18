import { useEffect, useState } from "react";
import api from "../../api/interceptor";
import { MessageSquareText } from "lucide-react";

// ✅ UX: Skeleton component for a better loading experience
const ChatItemSkeleton = () => (
  <div className="flex items-center p-3 animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// ✅ REFACTORED: Now accepts `selectedChatId` as a prop
export default function ChatSidebar({
  currentUserId,
  onSelectChat,
  refreshFlag,
  selectedChatId,
}) {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  // ✅ UX: Added loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/chat/fetch-chats`);
        setChats(response.data || []);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats.");
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [currentUserId, refreshFlag]);

  const getOtherUser = (chat) => {
    return chat.members?.find((user) => user._id !== currentUserId) || null;
  };

  return (
    // ✅ REFACTORED: Simplified outer div; parent now controls width and borders.
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // ✅ UX: Show skeleton loaders
          <div className="p-2">
            <ChatItemSkeleton />
            <ChatItemSkeleton />
            <ChatItemSkeleton />
          </div>
        ) : error ? (
          <div className="mt-4 text-center text-red-500 text-sm p-4">{error}</div>
        ) : chats.length === 0 ? (
          <div className="mt-4 text-center text-gray-500 text-sm p-4">
            <MessageSquareText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">No conversations yet.</p>
            <p>Start a chat from a user's profile.</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chats.map((chat) => {
              const otherUser = getOtherUser(chat);
              // ✅ REFACTORED: `isSelected` now uses the prop, not internal state
              const isSelected = chat._id === selectedChatId;

              const lastMsg = chat.lastMessage;
              const hasUnread = lastMsg && !lastMsg.isRead && lastMsg.senderId?._id !== currentUserId;

              return (
                <div
                  key={chat._id}
                  onClick={() => onSelectChat(chat)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150
                    ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="relative shrink-0 mr-3">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={otherUser?.profile_photo_url || "/placeholder.svg"}
                      alt={otherUser?.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                      {otherUser ? otherUser.name : "Unknown User"}
                    </p>
                    <p className={`text-sm truncate ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                      {lastMsg ? (lastMsg.messageType === 'text' ? lastMsg.messageText : '[Attachment]') : "No messages yet"}
                    </p>
                  </div>

                  {hasUnread && (
                    <div className="ml-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm shrink-0">
                      {/* Can eventually show count here */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}