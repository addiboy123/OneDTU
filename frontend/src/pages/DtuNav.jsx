import Navbar from "../components/Navbar";
import React, { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react"; // ✅ Import search icon

// -----------------------------
// Card Data
// -----------------------------
const cardData = [
  {
    title: "Admin Block",
    imageUrl: "https://dtu.ac.in/Web/About/Images/admin_dtu.jpg",
    link: "https://www.google.com/maps?q=Admin+Block,+DTU",
  },
  {
    title: "Library",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/DelhiCollegeOfEngineering_Library.jpg/640px-DelhiCollegeOfEngineering_Library.jpg",
    link: "https://www.google.com/maps?q=Library,+DTU",
  },
  {
    title: "Senior Boys Hostel",
    imageUrl: "https://hostels.dtu.ac.in/images/hostels/apj-hostel.png",
    link: "https://maps.app.goo.gl/7Ld5Yjt1AGuv8G8o8",
  },
  {
    title: "VLB Girls Hostel",
    imageUrl: "https://hostels.dtu.ac.in/images/hostels/vlb-hostel.png",
    link: "https://maps.app.goo.gl/yeakmitFSJv4qU8w5",
  },
  {
    title: "Pragya Bhawan",
    imageUrl:"https://i.postimg.cc/L5zxRvgf/unnamed.jpg",
    link: "https://maps.app.goo.gl/aqobE7ZmSkjRpzaM8",
  },
  {
    title: "OAT (Open Air Theatre)",
    imageUrl:
      "https://scontent.fpat8-1.fna.fbcdn.net/v/t39.30808-6/465361014_9328523277178390_8939195371344015296_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=SnSGpA1t66kQ7kNvwE1KzqQ&_nc_oc=Adm4ERBxLAlyA8hUNKVQAHu-rTTj7tEad5g-3ZfsuL0fBBIuK7NB5utPMW5UX-qxfno&_nc_zt=23&_nc_ht=scontent.fpat8-1.fna&_nc_gid=dMOPuSYGmAHZEVzIiazaAg&oh=00_Afe3cql1TmiiWCysA2jomisyBkadLUtGEuAa7DfP3J9aAQ&oe=68F7CA12",
    link: "https://www.google.com/maps?q=OAT,+DTU",
  },
  {
    title: "Sports Complex",
    imageUrl:
      "https://content3.jdmagicbox.com/v2/comp/delhi/a2/011pxx11.xx11.190719235416.t9a2/catalogue/dtu-sports-complex-delhi-sports-clubs-4dgq2umsbl.jpg",
    link: "https://www.google.com/maps?q=Football+Ground,+DTU",
  },
  {
    title: "Academic Blocks",
    imageUrl: "https://i.postimg.cc/brWLmW82/Whats-App-Image-2025-10-16-at-19-03-02.jpg",
    link: "https://maps.app.goo.gl/Dj9zfK4EukubR9Pg9",
  },
  {
    title: "SPS 9-12",
    imageUrl: "https://i.postimg.cc/HLHPyq6d/sps9-12.webp",
    link: " https://maps.app.goo.gl/Qp5U46vLma2SU4tQA",
  },
  {
    title: "SPS 1-8",
    imageUrl:
      "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nq-lRLp_CbSM6lwveR_n4jD3Z0SUl_KOq43QdGPKagOpXLXMQglbTZizrTXYiOpfZZjG3kWLIP0iPKYBEBQ8EzGEwOugj2ucNNLJTkLAMShmxAE-XRrQnnxbP3DGIYtwV1V50jR=w203-h360-k-no",
    link: "https://maps.app.goo.gl/z4cCUtM77PEAsUnZ8",
  },
  {
    title: "ECE, Civil, Elect",
    imageUrl:
      "https://dtu.ac.in/modules/alumni_old/images2/1483124_560602227348292_142122668_n.jpg",
    link: "https://maps.app.goo.gl/76niJxaoZjZssurM9",
  },
  {
    title: "Health Center",
    imageUrl: "https://dtu.ac.in/Web/Facilities/images/health_center.jpeg",
    link: "https://maps.app.goo.gl/uDa6qPXyWQu3Z4Xs6",
  },
  {
    title: "Concert Ground",
    imageUrl:
      "https://i.postimg.cc/c17T59RX/Screenshot-2025-10-17-at-18-55-14.png",
    link: "https://maps.app.goo.gl/ZEDs39Ct3431xoiW7",
  },
  {
    title: "Nescafe DTU",
    imageUrl:"https://media.licdn.com/dms/image/v2/D5622AQFZZPft5glAJQ/feedshare-shrink_800/feedshare-shrink_800/0/1720155925035?e=2147483647&v=beta&t=wBqRNQ4cAyKdudXffX2iv3L-iQ0m2IGow4hy82nteSo",
    link: "https://maps.app.goo.gl/KLm4Wpzc7eaGtKJg6",
  },
  {
    title: "HIMS and DelTech",
    imageUrl:"https://i.postimg.cc/QdZ8xM9N/Gemini-Generated-Image-a5cm4a5cm4a5cm4a.png",
    link: "https://maps.app.goo.gl/cd45nSKkvG7jc5Jz9",
  },
  
  // -----------------------------
  // New Additions
  // -----------------------------
 
];

// -----------------------------
// Interactive Card Component
// -----------------------------
const InteractiveCard = ({ title, imageUrl, link }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const intensity = 8;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = intensity * ((x - rect.width / 2) / (rect.width / 2));
      const rotateX = -intensity * ((y - rect.height / 2) / (rect.height / 2));
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group bg-white/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-200 ease-out overflow-hidden flex flex-col w-65 h-90"
    >
      <div className="relative h-2/3">
        <img
          src={imageUrl}
          alt={`${title} Thumbnail`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 flex flex-col justify-center flex-grow text-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          View on Map
        </a>
      </div>
    </div>
  );
};

// -----------------------------
// Header Component
// -----------------------------
const Header = () => (
  <header className="text-center mb-10 md:mb-16">
    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
      DTU Navigate
    </h1>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
      Explore your DTU campus effortlessly. Click any location below to open it directly in Google Maps.
    </p>
  </header>
);

// -----------------------------
// Footer Component
// -----------------------------
const Footer = () => (
  <footer className="text-center mt-10 md:mt-16">
    <p className="text-gray-400">
      &copy; {new Date().getFullYear()} Delhi Technological University. All Rights Reserved.
    </p>
  </footer>
);

// -----------------------------
// Main Page Component
// -----------------------------
export default function DtuNav() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = cardData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#383744ff" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <Header />

        {/* Search Bar with Icon */}
        <div className="w-full max-w-md mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search a location (e.g., Library, Hostel, OAT)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-600 bg-white/90 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md placeholder-gray-500"
          />
        </div>

        {/* Grid or No Results */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
            {filteredCards.map((card, index) => (
              <InteractiveCard key={index} {...card} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-300 mt-10 text-lg font-medium">
            No locations found 😔
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
