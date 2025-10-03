import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "HostelCart", path: "/hostelcart" },
    { name: "SocietyConnect", path: "/societyconnect" },
    { name: "FindMySpace", path: "/findmyspace" },
    { name: "DTUNavigate", path: "/dtunavigate" },
  ];

  return (
    <nav className="w-full bg-[#0d1117]/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-500">
            OneDTU
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-500 text-white">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
