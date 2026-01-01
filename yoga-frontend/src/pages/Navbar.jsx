import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/yogalogonew.png";
import "./CSS/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.clear();
    navigate("/"); // or redirect to login
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img className="logo-img" style={{width:"80px",height:"91px"}} src={logo} alt="Logo" />
        </Link>

        {/* Toggle Icon (☰ or ✖) */}
        <div className="hamburger" onClick={toggleMenu}>
          {menuOpen ? "✖" : "☰"}
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/price" onClick={closeMenu}>
              Pricing
            </Link>
          </li>
          <li>
            <Link to="/blogs" onClick={closeMenu}>
              Blog
            </Link>
          </li>
          <li>
            <Link to="/livestream" onClick={closeMenu}>
              Live Events
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu}>
              Contact Us
            </Link>
          </li>
          { user && <li className="block sm:hidden">
            {
              user.role === "ADMIN" ? (
                <Link to="/admin/admin-dashboard" onClick={closeMenu}>
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/user/dashboard" onClick={closeMenu}>
                  User Dashboard
                </Link>
              )
            }
          </li>}
          
          {/* <li>
            <Link to="/auth/login" onClick={closeMenu}>
              Login
            </Link>
          </li> */}
          {!user && <li className="join-now">
            <Link
              className="border-green-500"
              to="/auth/register"
              onClick={closeMenu}
            >
p              Join Free Trial
            </Link>
          </li>}
          {
            user && (
              <li className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold border-2 border-green-700 shadow-lg hover:scale-110 transition duration-200"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute  right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-2 text-sm text-gray-800">
                      {
                        user.role === "ADMIN" ? (
                          <Link
                            to="/admin/admin-dashboard"
                            className="block px-4 py-2 hover:bg-green-100 transition"
                          >
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            to="/user/dashboard"
                            className="block px-4 py-2 hover:bg-green-100 transition"
                          >
                            User Dashboard
                          </Link>
                        )
                      }
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-green-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>

            )
          }

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
