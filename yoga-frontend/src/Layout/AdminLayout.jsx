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
  { name: "Manage Classes", icon: <SlGraduation /> , path: "classes" },
  { name: "Free Trial Campaign", icon: <SlMagnet />, path: "manage-campign" },
  { name: "Manage Payment", icon: <MdOutlinePayment />, path: "managePayment" },
  { name: "Manage Referral", icon: <SlLink />, path: "refferal" },
  { name: "Scheduled Messages", icon: <SlClock />, path: "scheduledMessage" },
  { name: "Manage Common Link", icon: <SlLink />, path: "manage-common-link" },
  { name: "Retreat Users", icon: <SlPeople />, path: "retreat-users" },
  { name: "Overseas Users", icon: <SlPeople />, path: "overseas-inquiries" },
  { name: "Dietician Session", icon: <SlCalender />, path: "dietician-session" },
  { name: "Dietician Leads", icon: <SlPeople />, path: "dietician-leads" },
  { name: "Yoga Session", icon: <SlCalender />, path: "yoga-session" },
  { name: "Yoga Leads", icon: <SlPeople />, path: "yoga-session-leads" },
  { name: "YogaCare Users", icon: <SlPeople />, path: "yogacare" },
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
  }, [token, navigate]);

  return (
    <div className="admin-container">
      <Navbarr open={open} setOpen={setOpen} text="Admin Panel" />

      <div className="admin-body">
        <Sidebar menuItems={menuItems} open={open} setOpen={setOpen} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Adminlayout;
