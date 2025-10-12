import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import Referral from "../Admin/Referral";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAdminStats } from "../services/api";
import toast from "react-hot-toast";
import "./CSS/admindashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const userdata = JSON.parse(localStorage.getItem("user"));
  const user = {
    id: userdata.id,
    name: userdata.name,
  };

  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    subscriptionGrowth: [],
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getAdminStats(); // should call getAnalytics controller
        setAnalytics({
          userGrowth: res.data.userGrowth || [],
          subscriptionGrowth: res.data.subscriptionGrowth || [],
        });
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to fetch analytics");
      }
    }

    fetchStats();
  }, []);

  const userGrowthChart = {
    labels: analytics.userGrowth.map((item) => item.month),
    datasets: [
      {
        label: "Users Registered",
        data: analytics.userGrowth.map((item) => item.usersRegistered),
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66,165,245,0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const subscriptionChart = {
    labels: analytics.subscriptionGrowth.map((item) => item.month),
    datasets: [
      {
        label: "Free Trial",
        data: analytics.subscriptionGrowth.map((item) => item.freeTrial),
        backgroundColor: "#FFB300",
      },
      {
        label: "Paid",
        data: analytics.subscriptionGrowth.map((item) => item.paid),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-4xl font-bold  bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
        Welcome, {user.name}
      </h2>

      {/* 📈 Line Chart: User Growth */}
      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <h3 className="text-lg font-medium mb-4">User Growth Over Time</h3>
        <Line data={userGrowthChart} />
      </div>

      {/* 📊 Bar Chart: Subscription Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <h3 className="text-lg font-medium mb-4">Subscriptions Per Month</h3>
        <Bar data={subscriptionChart} />
      </div>

      {/* ✅ Referral block */}
      <Referral userId={user.id} />
    </div>
  );
};

export default Dashboard;
