import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

const Home = () => {
  const features = [
    { title: "HostelCart", desc: "Find and book your perfect hostel space with ease." },
    { title: "SocietyConnect", desc: "Connect with DTU societies and events instantly." },
    { title: "FindMySpace", desc: "Locate study spaces, hangout spots, and more." },
    { title: "DTUNavigate", desc: "Navigate DTU with real-time maps and guidance." },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-6">
          OneDTU
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8">
          One platform for all DTU needs — hostels, societies, spaces, and navigation. 
          Built for students, by students.
        </p>

        <div className="flex gap-4 justify-center">
          {/* If logged in show greeting; else show CTA */}
          {(() => {
            try {
              const decoded = JSON.parse(atob((localStorage.getItem('token')||'').split('.')[1] || '')) || null;
              if (decoded && decoded.exp * 1000 > Date.now()) {
                return <div className="text-lg text-gray-200">Hi! {decoded.name || decoded.fullName || decoded.email}</div>;
              }
            } catch (e) {}
            return (
              <>
                <Button asChild className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button variant="outline" asChild className="border-blue-600 text-blue-400 hover:bg-blue-600/20 px-6 py-3 rounded-lg text-lg">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            );
          })()}
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111827]">
        <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="bg-[#1f2937] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">{f.title}</h3>
              <p className="text-gray-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-bold text-blue-500">5K+</h3>
            <p className="text-gray-400 mt-2">Students Onboarded</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-blue-500">50+</h3>
            <p className="text-gray-400 mt-2">Active Societies</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-blue-500">100+</h3>
            <p className="text-gray-400 mt-2">Hostels Listed</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} OneDTU. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
