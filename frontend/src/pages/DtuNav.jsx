import Navbar from "../components/Navbar";
import React, { useRef, useEffect } from 'react';

// Card data - makes it easy to add, remove, or modify cards in the future
const cardData = [
    {
        title: "Academics",
        description: "Stay updated with the latest academic schedule, holidays, and examination dates for the current session.",
        buttonText: "View Calendar",
        imageUrl: "https://placehold.co/600x400/3B82F6/FFFFFF?text=Academics"
    },
    {
        title: "Admissions",
        description: "Find all the information you need about undergraduate, postgraduate, and doctoral program admissions.",
        buttonText: "Visit Portal",
        imageUrl: "https://placehold.co/600x400/2563EB/FFFFFF?text=Admissions"
    },
    {
        title: "Examinations",
        description: "Access exam schedules, results, and other important notices from the university's examination branch.",
        buttonText: "Check Notices",
        imageUrl: "https://placehold.co/600x400/1D4ED8/FFFFFF?text=Exams"
    },
    {
        title: "DTU Times",
        description: "Read the official newsletter to catch up on campus news, events, and student achievements.",
        buttonText: "Read Now",
        imageUrl: "https://placehold.co/600x400/1E3A8A/FFFFFF?text=News"
    },
    {
        title: "Library Portal",
        description: "Access the central library's vast collection of e-books, journals, and research papers online.",
        buttonText: "Explore Resources",
        imageUrl: "https://placehold.co/600x400/1E40AF/FFFFFF?text=Library"
    }
];

// Reusable Card Component with Tilt Effect
const InteractiveCard = ({ title, description, buttonText, imageUrl }) => {
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
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        
        <div
            ref={cardRef}
            className="group bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-200 ease-out overflow-hidden flex flex-col"
        >
             
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={`${title} Thumbnail`}
                    className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
                <p className="mt-2 text-blue-800 text-sm flex-grow">
                    {description}
                </p>
                <a href="#" className="mt-6 block text-center bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    {buttonText}
                </a>
            </div>
        </div>
    );
};

// Header Component
const Header = () => (
    <header className="text-center mb-10 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
            DTU Quick Links
        </h1>
        <p className="mt-4 text-lg text-blue-800/90 max-w-2xl mx-auto">
            Your one-stop portal for essential Delhi Technological University resources. Navigate to important sections of the DTU website with ease.
        </p>
    </header>
);

// Footer Component
const Footer = () => (
     <footer className="text-center mt-10 md:mt-16">
        <p className="text-blue-800/80">
            &copy; 2024 Delhi Technological University. All Rights Reserved.
        </p>
    </footer>
);


// Main App Component
export default function App() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen flex flex-col">
            
            {/* Navbar at the top */}
            <Navbar />

            {/* Main content */}
            <main className="flex-grow w-full max-w-6xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <Header />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {cardData.map((card, index) => (
                        <InteractiveCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            buttonText={card.buttonText}
                            imageUrl={card.imageUrl}
                        />
                    ))}
                </div>
                <Footer />
            </main>
        </div>
    );
}
