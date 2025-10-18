import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import getDecodedToken from "../lib/auth";
import socket from "../lib/socket";
import LoginPromptModal from "../components/LoginPromptModal";
import Navbar from "../components/Navbar";

export default function Chat() {
  const navigate = useNavigate();
  const decodedUser = getDecodedToken();
  const [selectedChat, setSelectedChat] = useState(null);
  const [refreshChats, setRefreshChats] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(!decodedUser);

  const isAuthenticated = !!decodedUser;

  useEffect(() => {
    if (isAuthenticated && decodedUser?.userId) {
      socket.emit("setup", decodedUser.userId);
    }
  }, [isAuthenticated, decodedUser?.userId]);

  if (!isAuthenticated) {
    return (
      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => {
          setIsLoginPromptOpen(false);
          navigate("/", { replace: true }); // Force redirect on close
        }}
      />
    );
  }

  return (
    <>
      <Navbar />
      {/* ✅ RESPONSIVE: Container uses calc() to fill height below the navbar */}
      <div className="flex h-[calc(100vh-4rem)] bg-gray-100 overflow-hidden">
        {/* --- ChatSidebar --- */}
        {/* ✅ RESPONSIVE:
            - Hidden on mobile (`hidden`) if a chat is selected.
            - Takes full width on mobile (`w-full`) when visible.
            - On large screens (`lg:`), it's always visible (`lg:flex`) and takes a fractional width.
        */}
        <div
          className={`
            ${selectedChat ? "hidden" : "flex"} w-full flex-col 
            lg:flex lg:w-[360px] xl:w-[400px] shrink-0
            border-r border-gray-200 bg-white
          `}
        >
          <ChatSidebar
            currentUserId={decodedUser.userId}
            onSelectChat={setSelectedChat}
            refreshFlag={refreshChats}
            selectedChatId={selectedChat?._id}
          />
        </div>

        {/* --- ChatWindow --- */}
        {/* ✅ RESPONSIVE:
            - Hidden on mobile (`hidden`) if NO chat is selected.
            - On large screens, it's always visible.
        */}
        <div className={`${selectedChat ? "flex" : "hidden"} w-full flex-col lg:flex`}>
          <ChatWindow
            key={selectedChat?._id} // Add key to force re-mount on chat change
            selectedChat={selectedChat}
            currentUserId={decodedUser.userId}
            setRefreshChats={setRefreshChats}
            // ✅ RESPONSIVE: Pass a function to go back to the chat list on mobile
            onBack={() => setSelectedChat(null)}
          />
        </div>
        
        {/* ✅ RESPONSIVE: Placeholder for when no chat is selected on large screens */}
        {/* {!selectedChat && (
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
              

[Image of speech bubbles for chat]

              <h2 className="text-2xl font-semibold text-gray-800">Select a Chat</h2>
              <p className="mt-2 text-gray-500">
                Choose a conversation from the left to start messaging.
              </p>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}