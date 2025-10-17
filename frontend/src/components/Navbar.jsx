import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import getDecodedToken from "../lib/auth";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "HostelCart", path: "/hostelcart" },
    { name: "SocietyConnect", path: "/societyconnect" },
    { name: "FindMySpace", path: "/findmyspace" },
    { name: "DTUQuickLinks", path: "/dtuquicklinks" },
    { name: "DTUNavigate", path: "/dtunav"}
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef();
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

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("auth-changed", onAuthChange);
    window.addEventListener("storage", onStorage);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("auth-changed", onAuthChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
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
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen((s) => !s)}
                  className="flex items-center gap-2 p-1 rounded-full focus:outline-none"
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg border animate-fadeIn">
                    <div className="px-4 py-2 text-sm">Hi, {userName}</div>
                    <div className="border-t" />
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
        <div className="md:hidden bg-[#0d1117]/95 backdrop-blur-lg border-t border-gray-700">
          <div className="flex flex-col items-start space-y-2 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="w-full text-gray-300 hover:text-white py-2 border-b border-gray-800 text-sm"
              >
                {link.name}
              </Link>
            ))}

            <div className="w-full mt-3">
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-2 w-full">
                  <Button
                    variant="outline"
                    asChild
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/20 w-full"
                  >
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
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
                <div className="w-full border-t border-gray-700 pt-3">
                  <div className="flex items-center gap-3">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-300 text-sm">
                      Hi, {userName}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-300 hover:text-white py-1 text-sm"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white py-1 text-sm text-left"
                    >
                      Logout
                    </button>
                  </div>
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
