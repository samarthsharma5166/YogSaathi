import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbarr from "../components/Navbar";
import Sidebar from "../Admin/Dashboardsidebar";
import LogoutIcon from "@mui/icons-material/Logout";
import { SlGrid, SlPeople, SlBookOpen, SlCalender, SlWallet, SlGraduation, SlMagnet, SlLink, SlClock, SlLogout } from "react-icons/sl";


import {
  Dashboard as DashboardIcon,
  Assignment as PlanIcon,
  BookOnline as BookingIcon,
  Payment as PaymentIcon,
  Group as ReferralIcon,
} from "@mui/icons-material";

import "./CSS/userlayout.css"; // ✅ Use this for styling

const menuItems = [
  { name: "Dashboard", icon: <SlGrid />, path: "dashboard" },
  { name: "My Plans", icon: <SlWallet />, path: "myPlans" },
  // { name: "Bookings", icon: <BookingIcon />, path: "classbook" },
  { name: "Referrals", icon: <SlLink />, path: "refferal" },
  { name: "Logout", icon: <SlLogout />, path: "logout" },
];

const Userlayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="user-container">
      <Navbarr open={open} setOpen={setOpen} text="User Panel" />

      <div className="user-body">
        <Sidebar menuItems={menuItems} open={open} setOpen={setOpen} />

        <div className="user-main-content ">
          <Outlet />
          {/* {location.pathname === "/user/logout" ? (
            <Outlet />
          ) : (
            <h1 className="text-2xl ">Comming Soon....</h1>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Userlayout;