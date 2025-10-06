function HeaderTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center items-center gap-4 p-4 bg-white border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-700">Find:</h2>
      <button
        onClick={() => setActiveTab("FLAT")}
        className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
          activeTab === "FLAT"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Flats
      </button>

      <button
        onClick={() => setActiveTab("PG")}
        className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
          activeTab === "PG"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        PGs
      </button>
    </div>
  );
}

export default HeaderTabs;