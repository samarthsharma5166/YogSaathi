import React, { useState } from "react";
import { downloadAttendance } from "../services/api.js";
import toast from "react-hot-toast";
import { Filter, Download } from "lucide-react";

const userType = {
  "ALL": "ALL",
  "ADMIN": "Admin",
  "Active-Free-Trial":"Active Free Trial",
  "Inactive-Free-Trial":"Inactive Free Trial",
  "Active-Subscribers":"Active Subscribers",
  "Inactive-Subscribers":"Inactive Subscribers",
}

const DownloadAttendance = () => {
  const [filter, setFilter] = useState(userType.ALL);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownload = async () => {
    try {
      const res = await downloadAttendance(filter, startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Attendance downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to download attendance.");
    }
  };

  return (
    <div className=" bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="bg-white flex justify-between rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ">Download Attendance</h2>
      </div>
        <div className="flex justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm font-medium min-w-[140px] cursor-pointer hover:border-green-400 transition-colors"
                >
                <option value="ALL">{userType.ALL}</option>
                    <option value="ADMIN">{userType.ADMIN}</option>
                    <option value="Active-Free-Trial">{userType["Active-Free-Trial"]}</option>
                    <option value="Inactive-Free-Trial">{userType["Inactive-Free-Trial"]}</option>
                    <option value="Active-Subscribers">{userType["Active-Subscribers"]}</option>
                    <option value="Inactive-Subscriber">{userType["Inactive-Subscribers"]}</option>
                </select>
            </div>
          <div className="flex items-center gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm font-medium"
              />
            </div>
            
                    <div>
            <label className="text-sm font-medium text-gray-700">End Date: </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm font-medium"
              />
                    </div>
          </div>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
        </div>
    </div>
  );
};

export default DownloadAttendance;
