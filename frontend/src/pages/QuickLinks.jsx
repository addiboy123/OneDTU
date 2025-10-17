import Navbar from "../components/Navbar";
import React, { useRef, useEffect } from "react";

// -----------------------------
// Card Data (with actual DTU links)
// -----------------------------
const cardData = [
  {
    title: "Academics",
    imageUrl: "https://dtu.ac.in/modules/dtutimes/times/images/gallery/codtu/25.jpg",
    link: "https://dtu.ac.in/Web/Academics/academic_calender.php",
  },
  {
    title: "Results",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJucN7Q9cPOe1wqTTlo48fVJxF3_2ldc9_xg&s",
    link: "https://exam.dtu.ac.in/result.htm",
  },
  {
    title: "Notices",
    imageUrl: "https://i.postimg.cc/3r4L9FnL/Gemini-Generated-Image-54cyh054cyh054cy-2.png",
    link: "https://exam.dtu.ac.in/Notices-n-Circulars.htm",
  },
  {
    title: "Registration",
    imageUrl: "https://i.postimg.cc/WbQcX4GJ/Screenshot-2025-10-11-at-16-29-09.png",
    link: "https://reg.exam.dtu.ac.in/student/login",
  },
  {
    title: "Library Portal",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGX5VqJy4PCrTnlbpwtmj_RClmM3kUZmjXQ&s",
    link: "https://dtu.bestbookbuddies.com/",
  },
  {
    title: "Hostel Registration",
    imageUrl: "https://hostels.dtu.ac.in/images/hostels/apj-hostel.png",
    link: "https://saarthi.dtu.ac.in/hostel/hostel_prod_2025/hostel_registration/Login.php#",
  }
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
          Visit Link
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
      DTU Quick Links
    </h1>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
      Your one-stop portal for essential DTU resources. Navigate the university
      with ease.
    </p>
  </header>
);

// -----------------------------
// Footer Component
// -----------------------------
const Footer = () => (
  <footer className="text-center mt-10 md:mt-16">
    <p className="text-gray-400">
      &copy; {new Date().getFullYear()} Delhi Technological University. All
      Rights Reserved.
    </p>
  </footer>
);

// -----------------------------
// Main Page Component
// -----------------------------
export default function DtuNav() {
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

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
          {cardData.map((card, index) => (
            <InteractiveCard key={index} {...card} />
          ))}
        </div>

        <Footer />
      </main>
    </div>
  );
}