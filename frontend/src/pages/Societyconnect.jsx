import { useState } from "react";
import Sidebar from "../components/societyconnect/Sidebar";
import Feed from "../components/societyconnect/Feed";
import Explore from "../components/societyconnect/Explore";
import Navbar from "../components/Navbar";

function SocietyConnect() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
        {/* Sidebar */}
        <div className="bg-[#181818] border-r border-[#2a2a2a]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Buttons */}
          <div className="flex justify-center gap-4 p-4 bg-[#181818] border-b border-[#2a2a2a] shadow-md">
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
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                activeTab === "explore"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300"
              }`}
            >
              Explore
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0f0f0f]">
            {activeTab === "feed" ? <Feed /> : <Explore />}
          </div>
        </div>
      </div>
    </>
  );
}

export default SocietyConnect;
