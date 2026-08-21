import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getYogaCareRegistrations, downloadYogaCareRegistrations, handleDownloadInvoice } from "../services/api";
import { Calendar, DollarSign, Users, Award, ShieldAlert, Sparkles, Filter, Download } from "lucide-react";

export default function ManageYogaCare() {
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await getYogaCareRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load registrations");
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await downloadYogaCareRegistrations();
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "yogacare-registrations.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download registrations");
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (filterStatus === "ALL") return true;
    return reg.status === filterStatus;
  });

  const totalEarningsInr = registrations
    .filter((r) => r.status === "PAID" && r.currency === "INR")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalEarningsUsd = registrations
    .filter((r) => r.status === "PAID" && r.currency === "USD")
    .reduce((sum, r) => sum + r.amount, 0);

  const paidCount = registrations.filter((r) => r.status === "PAID").length;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-600" /> YogaCare Program Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track subscriber bookings and payments for the YogaCare program.
          </p>
        </div>
        <button
          onClick={fetchRegistrations}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
        >
          Refresh Data
        </button>
      </div>

      {/* 📊 Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earnings (INR)</div>
            <div className="text-2xl font-extrabold text-gray-800">₹{totalEarningsInr.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earnings (USD)</div>
            <div className="text-2xl font-extrabold text-gray-800">${totalEarningsUsd}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Paid Bookings</div>
            <div className="text-2xl font-extrabold text-gray-800">{paidCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registrations</div>
            <div className="text-2xl font-extrabold text-gray-800">{registrations.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Download Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter Status:</span>
            <div className="flex gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
              {["ALL", "PAID", "PENDING"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    filterStatus === status
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Registrations (CSV)
          </button>
        </div>

        {/* Registrations List Table */}
        <div className="overflow-x-auto">
          {loadingRegs ? (
            <div className="py-20 text-center text-xs text-gray-500 font-semibold animate-pulse">
              Loading registrations...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500 font-semibold">No registrations found matching criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
                  <th className="py-3.5 px-6">Subscriber</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Programme</th>
                  <th className="py-3.5 px-4">Group Size</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Plan Selected</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Invoice</th>
                  <th className="py-3.5 px-6">Booked Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">{reg.customerName}</td>
                    <td className="py-4 px-4">
                      <div>{reg.phone}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{reg.email}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-green-800">{reg.programName}</td>
                    <td className="py-4 px-4 capitalize">
                      {reg.participantType === "individual" ? "1 Participant" : "2–5 Participants"}
                    </td>
                    <td className="py-4 px-4 capitalize">{reg.region}</td>
                    <td className="py-4 px-4 uppercase text-[10px] bg-gray-50 border rounded-md inline-block px-2 py-0.5 mt-3 ml-4">
                      {reg.planId.replace("_", " ")}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {reg.currency === "INR" ? "₹" : "$"}{reg.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.status === "PAID"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {reg.invoice ? (
                        <button
                          onClick={() => handleDownloadInvoice(reg.invoice)}
                          className="text-xs text-green-600 hover:text-green-800 font-bold hover:underline cursor-pointer"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
