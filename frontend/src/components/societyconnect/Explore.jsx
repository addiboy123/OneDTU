import { useState } from "react";

function Explore() {
  const [selectedSociety, setSelectedSociety] = useState(null);

  // Static sample societies (no API calls)
  const societies = [
    {
      _id: "s1",
      name: "Photography Club",
      coverImage: "https://picsum.photos/seed/photography/600/400",
      description:
        "A place for students who love photography. We organise walks, workshops and exhibitions.",
      images: [
        "https://picsum.photos/seed/phot1/400/300",
        "https://picsum.photos/seed/phot2/400/300",
        "https://picsum.photos/seed/phot3/400/300",
      ],
    },
    {
      _id: "s2",
      name: "Coding Society",
      coverImage: "https://picsum.photos/seed/coding/600/400",
      description:
        "Weekly coding challenges, hackathons and study groups for all levels.",
      images: [
        "https://picsum.photos/seed/code1/400/300",
        "https://picsum.photos/seed/code2/400/300",
      ],
    },
    {
      _id: "s3",
      name: "Drama Circle",
      coverImage: "https://picsum.photos/seed/drama/600/400",
      description: "Plays, improv nights and open-mic sessions every month.",
      images: ["https://picsum.photos/seed/dram1/400/300"],
    },
    {
      _id: "s4",
      name: "Music Society",
      coverImage: "https://picsum.photos/seed/music/600/400",
      description: "Jamming sessions, concerts and music-production workshops.",
      images: ["https://picsum.photos/seed/mus1/400/300", "https://picsum.photos/seed/mus2/400/300"],
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {societies.map((society) => (
        <div
          key={society._id}
          className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md p-3"
          onClick={() => setSelectedSociety(society)}
        >
          <img
            src={society.coverImage}
            alt={society.name}
            className="rounded-md h-32 w-full object-cover mb-2"
          />
          <h3 className="font-semibold text-gray-800">{society.name}</h3>
        </div>
      ))}

      {/* Society Modal */}
      {selectedSociety && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
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

export default Explore;
