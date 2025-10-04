import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import getDecodedToken from "../lib/auth";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "HostelCart", path: "/hostelcart" },
    { name: "SocietyConnect", path: "/societyconnect" },
    { name: "FindMySpace", path: "/findmyspace" },
    { name: "DTUNavigate", path: "/dtunavigate" },
  ];

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const [decoded, setDecoded] = useState(() => getDecodedToken());
  const isLoggedIn = Boolean(decoded);
  const userName = decoded?.name || decoded?.fullName || "User";
  const userImage = decoded?.picture || decoded?.profile_photo_url || null;

  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    function onAuthChange() {
      setDecoded(getDecodedToken());
    }
    function onStorage(e) {
      if (e.key === 'token') setDecoded(getDecodedToken());
    }

    document.addEventListener("click", onDoc);
    window.addEventListener('auth-changed', onAuthChange);
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener("click", onDoc);
      window.removeEventListener('auth-changed', onAuthChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setOpen(false);
    window.location.reload();
  };

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

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" asChild className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setOpen((s) => !s)} className="flex items-center gap-2 p-1 rounded-full">
                  {userImage ? (
                    <img src={userImage} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">{(userName || "U").charAt(0)}</div>
                  )}
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg border">
                    <div className="px-4 py-2 text-sm">Hi! {userName}</div>
                    <div className="border-t" />
                    <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
