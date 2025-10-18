// src/components/societyconnect/Sidebar.jsx

import { useEffect, useState } from "react";
import { X } from 'lucide-react'; // For the close button
import api from "../../api/interceptor";

// ✅ UX: A skeleton loader component for a better loading experience
const SocietyListItemSkeleton = () => (
  <div className="mb-3 p-3 rounded-lg bg-[#222] animate-pulse">
    <div className="h-5 bg-[#3a3a3a] rounded w-3/4"></div>
  </div>
);

// ✅ RESPONSIVE: Accept isOpen and onClose props
function Sidebar({ isOpen, onClose }) {
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This hook fetches data and is well-written. No changes needed here.
    let mounted = true;
    const fetchSocieties = async () => {
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

    fetchSocieties();
    return () => (mounted = false);
  }, []);

  // ✅ FIX: Use a React Fragment to separate the sidebar from the modal.
  // This prevents the modal from being hidden when the sidebar slides out on mobile.
  return (
    <>
      <aside
        // ✅ RESPONSIVE: Added classes for responsive behavior and smooth transitions
        className={`
          fixed top-0 left-0 h-full bg-[#181818] text-gray-100 border-r border-[#2a2a2a] z-30
          flex flex-col shrink-0 w-72 lg:w-64
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-semibold tracking-wide text-gray-200">
            Your Societies
          </h2>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4">
          {loading ? (
            // ✅ UX: Render multiple skeleton items while loading
            <>
              <SocietyListItemSkeleton />
              <SocietyListItemSkeleton />
              <SocietyListItemSkeleton />
            </>
          ) : error ? (
            <div className="text-red-500 p-3 bg-red-900/20 rounded-lg">{error}</div>
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
        </div>
      </aside>

      {/* Modal for displaying society details */}
      {selectedSociety && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#2f2f2f] relative text-gray-100">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-3xl font-light"
              onClick={() => setSelectedSociety(null)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-2 text-white pr-8">
              {selectedSociety.name}
            </h3>

            <p className="text-gray-400 mb-4 max-h-24 overflow-y-auto">
              {selectedSociety.description || "No description available"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto">
              {selectedSociety.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedSociety.name} gallery image ${idx + 1}`}
                  className="rounded-lg object-cover h-24 w-full border border-[#2a2a2a]"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;