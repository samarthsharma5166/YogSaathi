import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/yogalogonew.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blogs" },
    { name: "Live Events", path: "/livestream" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-2 group">
            <img
              className="w-16 h-auto transition-transform duration-300 group-hover:scale-105"
              src={logo}
              alt="YogSaathi Logo"
            />
            {/* <span className={`font-semibold text-xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-gray-800'}`}>YogSaathi</span> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-green-600 ${
                    location.pathname === link.path ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-gray-300 pl-4">
              <Link
                to="/price"
                className="ml-4 inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
               >
                Subscriptions
              </Link>
              {/* <Link
                to="/retreat"
                className="ml-4 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                Rishikesh Retreat
              </Link> */}
              {/* <Link
                to="/session"
                className="ml-4 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                Sleep Sessions
              </Link> */}

              {!user ? (
                <Link
                  to="/auth/register"
                  className="ml-4 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Join Free Trial
                </Link>
              ) : (
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 origin-top-right animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      </div>
                      <Link
                        to={user.role === "ADMIN" ? "/admin/admin-dashboard" : "/user/dashboard"}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white shadow-lg rounded-b-2xl border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3 px-2">
            <Link
              to="/price"
              onClick={closeMenu}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              Subscriptions
            </Link>
            <Link
              to="/retreat"
              onClick={closeMenu}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-200"
            >
              Rishikesh Retreat
            </Link>
            {!user && (
              <Link
                to="/auth/register"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-200"
              >
                Join Free Trial
              </Link>
            )}
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
