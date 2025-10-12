// // src/components/Navbar.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./CSS/adminnavbar.css"; // optional styling

// const Navbar = () => {
//   const navigate = useNavigate();
//   const userType = localStorage.getItem("userType");
//   const userData = JSON.parse(localStorage.getItem("userData") || "{}");

//   const handleLogout = () => {
//     localStorage.clear(); // remove all login data
//     navigate("/login");  // redirect to login page
//   };

//   // Don't show Navbar if not logged in
//   if (!userType || !userData.firstName) return null;

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <h3>{userType === "admin" ? "Admin Panel" : "User Dashboard"}</h3>
//       </div>
//       <div className="navbar-right">
//         <span>Welcome, {userData.firstName}</span>
//         <button className="logout-btn" onClick={handleLogout}>Logout</button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
