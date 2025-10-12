import React, { useEffect, useState } from 'react';
import logo from '../assets/yogalogonew.png';
import '../pages/CSS/navbarr.css';
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ open, setOpen }) => {
  const [name, setName] = useState('');
  const [firstLetter, setFirstLetter] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.name) {
      setName(userData.name);
      setFirstLetter(userData.name.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <nav className="navbar">
      <div className='navbar-container'>
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="navbar-right">
          {name && (
            <>
              <span className="user-name hidden sm:block">Hi, {name}</span>
              <div className="profile-circle hidden sm:flex">{firstLetter}</div>
            </>
          )}
          <button className="menu-button md:hidden" onClick={() => setOpen(true)}>
            <MenuIcon fontSize="large" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
