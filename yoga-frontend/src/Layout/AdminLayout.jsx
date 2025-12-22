import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbarr from "../components/Navbar";
import Sidebar from "../Admin/Dashboardsidebar";
import "./CSS/adminlayout.css";
import { SlGrid, SlPeople, SlBookOpen, SlCalender, SlWallet, SlGraduation, SlMagnet, SlLink, SlClock, SlLogout } from "react-icons/sl";
import { MdOutlinePayment } from "react-icons/md";
import { MdOutlineLocalOffer } from "react-icons/md";

const menuItems = [
  { name: "Dashboard", icon: <SlGrid />, path: "admin-dashboard" },
  { name: "Manage Users", icon: <SlPeople />, path: "manage-user" },
  { name: "Manage Blog", icon: <SlBookOpen />, path: "create-blog" },
  { name: "Manage Plans", icon: <SlCalender />, path: "manage-Plans" },
  { name: "Manage Offers", icon: <MdOutlineLocalOffer />, path: "manage-offers" },
  { name: "My Plans", icon: <SlWallet />, path: "myPlans" },
  { name: "Manage classes", icon: <SlGraduation /> , path: "classes" },
  { name: "Free Trial Campign", icon: <SlMagnet />, path: "manage-campign" },

  // { name: "Manage Payment", icon: <ProgressIcon />, path: "price" },
  { name: "Manage Payment", icon: <MdOutlinePayment />, path: "managePayment" },

  { name: "Manage Refferal", icon: <SlLink />, path: "refferal" },
  { name: "scheduledMessage", icon: <SlClock />, path:"scheduledMessage"},
  { name: "Manage Common Link", icon: <SlLink />, path: "manage-common-link" },
  { name: "Logout", icon: <SlLogout />, path: "logout" }
];
const Adminlayout = () => {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/register");
    }
  });

  return (
    <div className="admin-container mt-20">
      <Navbarr open={open} setOpen={setOpen} text="" />

      <div className="admin-body">
        <Sidebar menuItems={menuItems} open={open} setOpen={setOpen} />
        {/* New Drawer */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Adminlayout;
