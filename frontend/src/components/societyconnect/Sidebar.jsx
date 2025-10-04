import { useState } from "react";

function Sidebar() {
  const [selectedSociety, setSelectedSociety] = useState(null);

  // Static sample followed societies
  const societies = [
    { _id: "s1", name: "Photography Club", description: "Photography events and outings.", images: [
      "https://picsum.photos/seed/phot1/400/300",
    ] },
    { _id: "s2", name: "Coding Society", description: "Study groups and hack nights.", images: [
      "https://picsum.photos/seed/code1/400/300",
    ] },
    { _id: "s3", name: "Music Society", description: "Jams and open mics.", images: [
      "https://picsum.photos/seed/mus1/400/300",
    ] },
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-4 border-r overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Your Societies</h2>

      {societies.map((society) => (
        <div
          key={society._id}
          onClick={() => setSelectedSociety(society)}
          className="cursor-pointer mb-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          {society.name}
        </div>
      ))}

      {/* Modal */}
      {selectedSociety && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500"
              onClick={() => setSelectedSociety(null)}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedSociety.name}</h3>
            <p className="text-gray-600 mb-4">
              {selectedSociety.description || "No description available"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {selectedSociety.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="society"
                  className="rounded-lg object-cover h-24 w-full"
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
