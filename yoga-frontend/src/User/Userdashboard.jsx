import React, { useState } from "react";
import CountUp from "react-countup";
import Referral from "../Admin/Referral";

const Dashboard = () => {
  const [stats, setStats] = useState({
    counselors: 24,
    students: 130,
    sessions: 58,
    complaints: 7,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  
  const StatCard = ({ label, value, dashArray, dashOffset, rotate }) => (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-24 h-24 mb-4">
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <circle
            cx="25"
            cy="25"
            r="19.5"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="11"
          />
          <circle
            cx="25"
            cy="25"
            r="19.5"
            fill="none"
            stroke="#4caf50"
            strokeWidth="11"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(${rotate} 25 25)`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-green-700">
          <CountUp end={value} duration={1.5} />
        </div>
      </div>
      <div className="text-gray-700 font-medium text-sm">{label}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg !p-6 !mb-6">
      <h2 className="bg-white rounded-xl shadow-lg !p-6 !mb-6 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        Welcome, {user.name}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={stats.counselors}
          dashArray="100.96"
          dashOffset="90.635"
          rotate="0"
        />
        <StatCard
          label="Total Classes"
          value={stats.students}
          dashArray="100.52"
          dashOffset="30.84"
          rotate="385"
        />
        <StatCard
          label="Payment Status"
          value={stats.sessions}
          dashArray="110.52"
          dashOffset="65.31"
          rotate="10"
        />
        <StatCard
          label="Referral Status"
          value={stats.complaints}
          dashArray="122.52"
          dashOffset="121.42"
          rotate="10"
        />
      </div>

      {/* 👇 Optional Referral Component */}
      <div className="mt-10">
        <Referral userId={user.id} />
      </div>
    </div>
  );
};

export default Dashboard;
