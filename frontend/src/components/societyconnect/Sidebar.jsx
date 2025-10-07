import { useEffect, useState } from "react";
import api from "../../api/interceptor";

function Sidebar() {
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/societyconnect/societies`);
        const data = res?.data?.societies ?? res?.data ?? [];
        if (!mounted) return;
        setSocieties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load societies", err);
        if (mounted) setError("Failed to load societies");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => (mounted = false);
  }, []);

  return (
    <div className="w-64 bg-[#181818] text-gray-100 border-r border-[#2a2a2a] shadow-xl p-5 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 tracking-wide text-gray-200">
        Your Societies
      </h2>

      {loading ? (
        <div className="text-gray-300">Loading…</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        societies.map((society) => (
          <div
            key={society._id ?? society.id}
            onClick={() => setSelectedSociety(society)}
            className="cursor-pointer mb-3 p-3 rounded-lg bg-[#222] hover:bg-[#333] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="font-medium">{society.name}</div>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedSociety && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1e1e1e] rounded-xl p-6 w-96 shadow-2xl border border-[#2f2f2f] relative text-gray-100">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-2xl"
              onClick={() => setSelectedSociety(null)}
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-2 text-white">
              {selectedSociety.name}
            </h3>

            <p className="text-gray-400 mb-4">
              {selectedSociety.description || "No description available"}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {selectedSociety.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="society"
                  className="rounded-lg object-cover h-24 w-full border border-[#2a2a2a]"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
