// src/pages/SocietyConnect.jsx

import { useState } from "react";
import { Menu } from 'lucide-react'; // ✅ RESPONSIVE: Icon for hamburger menu

import Sidebar from "../components/societyconnect/Sidebar";
import Feed from "../components/societyconnect/Feed";
import Explore from "../components/societyconnect/Explore";
import Navbar from "../components/Navbar";

function SocietyConnect() {
  const [activeTab, setActiveTab] = useState("feed");
  // ✅ RESPONSIVE: State to manage sidebar visibility on mobile/tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-[#0f0f0f] text-gray-100 font-sans">
        
        {/* ✅ RESPONSIVE: Sidebar is now passed state to control visibility */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* ✅ RESPONSIVE: Overlay for mobile view when sidebar is open */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Buttons */}
          <div className="flex items-center gap-4 p-4 bg-[#181818] border-b border-[#2a2a2a] shadow-md sticky top-0 z-10">
            {/* ✅ RESPONSIVE: Hamburger menu button, hidden on large screens */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full text-gray-300 hover:bg-[#2a2a2a]"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            {/* ✅ RESPONSIVE: Centering container for the tabs */}
            <div className="flex justify-center flex-grow">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === "feed"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300"
                }`}
              >
                Feed
              </button>

              <button
                onClick={() => setActiveTab("explore")}
                className={`ml-4 px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === "explore"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300"
                }`}
              >
                Explore
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          {/* ✅ RESPONSIVE: Adjusted padding for smaller screens */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f0f0f]">
            {activeTab === "feed" ? <Feed /> : <Explore />}
          </div>
        </div>
      </div>
    </>
  );
}

export default SocietyConnect;