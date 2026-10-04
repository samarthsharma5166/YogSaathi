import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/yogalogonew.png';
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ open, setOpen, text = "" }) => {
  const [name, setName] = useState('');
  const [firstLetter, setFirstLetter] = useState('U');

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.name) {
        setName(userData.name);
        setFirstLetter(userData.name.charAt(0).toUpperCase());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm flex items-center justify-between px-4 sm:px-6">
      {/* Left side: Hamburger (mobile) + Logo + Panel Badge */}
      <div className="flex items-center gap-3">
        <button
          className="p-1.5 rounded-lg text-gray-600 hover:text-green-700 hover:bg-gray-100 md:hidden transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon fontSize="medium" />
        </button>
        
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="YogSaathi Logo" className="h-10 sm:h-11 w-auto object-contain" />
        </Link>

        {text && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            {text}
          </span>
        )}
      </div>

      {/* Right side: User greeting + Avatar */}
      <div className="flex items-center gap-3">
        {name && (
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">
              Hi, <span className="text-green-700 capitalize font-bold">{name}</span>
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-sm ring-2 ring-green-100 uppercase">
              {firstLetter}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

