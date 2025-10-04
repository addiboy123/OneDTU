import { useState } from "react";
import Sidebar from "../components/societyconnect/Sidebar";
import Feed from "../components/societyconnect/Feed";
import Explore from "../components/societyconnect/Explore";

function SocietyConnect() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - stays always visible */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Buttons */}
        <div className="flex justify-center gap-4 p-4 bg-white shadow">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeTab === "feed"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Feed
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeTab === "explore"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Explore
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "feed" ? <Feed /> : <Explore />}
        </div>
      </div>
    </div>
  );
}

export default SocietyConnect;
