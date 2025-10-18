import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import getDecodedToken from "../lib/auth";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "HostelCart", path: "/hostelcart" },
    { name: "SocietyConnect", path: "/societyconnect" },
    { name: "FindMySpace", path: "/findmyspace" },
    { name: "DTUNavigate", path: "/dtunavigate" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef();
  const navigate = useNavigate();

  const [decoded, setDecoded] = useState(() => getDecodedToken());
  const isLoggedIn = Boolean(decoded);
  const userName = decoded?.name || decoded?.fullName || "User";
  const userImage = decoded?.picture || decoded?.profile_photo_url || null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target))
        setUserMenuOpen(false);
    };

    const onAuthChange = () => setDecoded(getDecodedToken());
    const onStorage = (e) => {
      if (e.key === "token") setDecoded(getDecodedToken());
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("auth-changed", onAuthChange);
    window.addEventListener("storage", onStorage);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("auth-changed", onAuthChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed")); // Ensure other tabs know
    navigate("/");
  };

  return (
    <nav className="w-full bg-[#0d1117]/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition"
          >
            OneDTU
          </Link>

          {/* Desktop Navigation */}
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

          {/* Auth Buttons / User */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <div className="relative flex items-center gap-4" ref={userRef}>
                <Link to="/chat" title="Chat">
                  <MessageCircle className="text-gray-300 hover:text-white" size={22} />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((s) => !s)}
                    className="flex items-center gap-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg border animate-fadeIn">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">Hi, {userName}</div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ✅ FIX: Mobile Menu Button & Chat Icon */}
          <div className="md:hidden flex items-center gap-4">
            {/* Conditionally render chat icon for logged-in users */}
            {isLoggedIn && (
              <Link to="/chat" title="Chat">
                <MessageCircle className="text-gray-300 hover:text-white" size={22} />
              </Link>
            )}
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1117]/95 backdrop-blur-lg border-t border-gray-700 animate-fadeIn">
          <div className="flex flex-col items-start space-y-1 px-4 pt-2 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="w-full text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md py-2 px-3 text-base"
              >
                {link.name}
              </Link>
            ))}

            <div className="w-full pt-3 mt-2 border-t border-gray-700">
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-3 w-full">
                  <Button
                    variant="outline"
                    asChild
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/20 w-full"
                  >
                    <Link to="/signup" onClick={() => setMenu-Open(false)}>
                      Sign Up
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                  >
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex items-center gap-3 px-3 mb-2">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-200 font-medium">
                      {userName}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="w-full block text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md py-2 px-3 text-base"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full block text-left text-red-400 hover:text-white hover:bg-gray-700/50 rounded-md py-2 px-3 text-base"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;