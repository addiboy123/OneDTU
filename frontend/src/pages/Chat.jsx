import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import getDecodedToken from "../lib/auth";
import socket from "../lib/socket";
import { LoginPromptModal } from "../components/LoginPromptModal";
import Navbar from "../components/Navbar";

export default function Chat() {
  const navigate = useNavigate();
  const decodedUser = getDecodedToken();
  const [selectedChat, setSelectedChat] = useState(null);
  const [refreshChats, setRefreshChats] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const isAuthenticated = !!decodedUser;
  // const isAuthenticated = true; // Always allow for testing
  useEffect(() => {
    if (isAuthenticated && decodedUser?.userId) {
      socket.emit("setup", decodedUser.userId);
    } else {
      setIsLoginPromptOpen(true);
    }
  }, [isAuthenticated, decodedUser?.userId]);

  if (!isAuthenticated) {
    return (
      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => {
          navigate("/", { replace: true }); // force redirect
        }}
      />
    );
  }

  return (
    <>
      <Navbar />
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <ChatSidebar
            currentUserId={decodedUser.userId}
            onSelectChat={setSelectedChat}
            refreshFlag={refreshChats}
        />
        <ChatWindow
            selectedChat={selectedChat}
            currentUserId={decodedUser.userId}
            setRefreshChats={setRefreshChats}
        />
        </div>
    </>
  );
}
