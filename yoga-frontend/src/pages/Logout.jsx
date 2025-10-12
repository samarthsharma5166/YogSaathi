import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Logout.css"; // Make sure the path is correct

function Logout() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); // Clear any stored login data
    navigate("/auth/login"); // Redirect to home page
  };

  const handleCancelPopup = () => {
    setShowPopup(false); // Hide the popup
  };

  return (
    <div className="logout-card">
      <div className="logout-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
          alt="Logout Icon"
        />
      </div>
      <div className="logout-message">
        <p>Click the button below to logout.</p>
      </div>
      <div className="logout-buttons">
        <button className="btn logout-btn" onClick={() => setShowPopup(true)}>
          Logout
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button className="btn logout-btn" onClick={handleLogout}>
                Yes, Log Me Out
              </button>
              <button className="btn cancel-btn" onClick={handleCancelPopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logout;
