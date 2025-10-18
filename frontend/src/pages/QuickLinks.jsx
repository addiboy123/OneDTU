import Navbar from "../components/Navbar";
import React, { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react"; // ✅ Importing icon

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
  },
  { title: "Applied Chemistry", imageUrl: "https://i.postimg.cc/4NM2RK03/Gemini-Generated-Image-9spvei9spvei9spv.png", link: "https://dtu.ac.in/Web/Departments/AppliedChemistry/faculty/" },
  { title: "Applied Mathematics", imageUrl: "https://i.postimg.cc/LXXjsDYp/Gemini-Generated-Image-v4ka16v4ka16v4ka.png", link: "https://dtu.ac.in/Web/Departments/AppliedMathematics/faculty/" },
  { title: "Applied Physics", imageUrl: "https://i.postimg.cc/6QCdSqkd/apphy.jpg", link: "https://dtu.ac.in/Web/Departments/AppliedPhysics/faculty/" },
  { title: "Biotechnology", imageUrl: "https://i.postimg.cc/Jhjbg0fK/biotec.jpg", link: "https://dtu.ac.in/Web/Departments/BioTech/about/" },
  { title: "Civil Engineering", imageUrl: "https://i.postimg.cc/Qd2Q01yM/civil.jpg", link: "https://dtu.ac.in/Web/Departments/Civil/faculty/" },
  { title: "CSE", imageUrl: "https://i.postimg.cc/x1wvtM4b/cse.jpg", link: "https://dtu.ac.in/Web/Departments/CSE/faculty/" },
  { title: "DSM", imageUrl: "https://i.postimg.cc/Dw9rBLMG/dsm.jpg", link: "https://dtu.ac.in/Web/Departments/DSM/faculty/" },
  { title: "ECE", imageUrl: "https://i.postimg.cc/6pkrYnmn/ece.jpg", link: "https://dtu.ac.in/Web/Departments/Electronics/faculty/" },
  { title: "Electrical Engineering", imageUrl: "https://i.postimg.cc/GmWFqG5T/electrical.jpg", link: "https://dtu.ac.in/Web/Departments/Electrical/faculty/" },
  { title: "Environmental Science & Engineering", imageUrl: "https://i.postimg.cc/VkxqDnVr/ese.jpg", link: "https://dtu.ac.in/Web/Departments/Environment/faculty/" },
  { title: "Humanities", imageUrl: "https://i.postimg.cc/6pkrYnmC/humaniti.jpg", link: "https://dtu.ac.in/Web/Departments/Humanities/faculty/" },
  { title: "Information Technology", imageUrl: "https://i.postimg.cc/cJfQjCpR/it.jpg", link: "https://dtu.ac.in/Web/Departments/InformationTechnology/faculty/" },
  { title: "Mechanical Engineering", imageUrl: "https://i.postimg.cc/nhy40BP4/me.jpg", link: "https://dtu.ac.in/Web/Departments/Mechanical/faculty/" },
  { title: "Design", imageUrl: "https://i.postimg.cc/KYtnVj6L/design.jpg", link: "https://dtu.ac.in/Web/Departments/design/faculty/" },
  { title: "USME", imageUrl: "https://i.postimg.cc/MG1y4HC9/univschool-Management.jpg", link: "https://dtu.ac.in/Web/Departments/eastcampus/faculty/" },
  { title: "Software Engineering", imageUrl: "https://i.postimg.cc/Dw9rBLMq/se.jpg", link: "https://dtu.ac.in/Web/Departments/SE/faculty/" },
  { title: "Physical Education", imageUrl: "https://i.postimg.cc/QMcpPC21/pe.jpg", link: "https://dtu.ac.in/Web/Departments/phyedu/faculty/" },
   {
      title: "DTU-IIF",
      imageUrl: "https://i.postimg.cc/sXxQ924p/Gemini-Generated-Image-7ypyg67ypyg67ypy.png",
      link: "https://dtuiif.accubate.app/user/login",
    },
    {
      title: "TnP Department",
      imageUrl: "https://i.postimg.cc/66SjZ2fr/Screenshot-2025-10-18-at-14-07-40.png",
      link: "https://tnp.dtu.ac.in/",
    },
    {
      title: "Syllabus & Curriculum",
      imageUrl: "https://i.postimg.cc/tTJZtgNW/Gemini-Generated-Image-s5curts5curts5cu.png",
      link: "https://www.dtu.ac.in/Web/Academics/syllabus.php",
    },

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
  <header className="text-center mb-10 md:mb-12">
    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
      DTU Quick Links
    </h1>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
      Your one-stop portal for essential DTU resources. Navigate the university with ease.
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
// Main Page Component with Search
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
            placeholder="Search for a link (e.g., Results, Hostel, Library)..."
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
            No results found 😔
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
