import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getDieticianConfig, updateDieticianConfig, getDieticianRegistrations, downloadDieticianRegistrations } from "../services/api";
import { Calendar, Clock, DollarSign, Users, Award, ShieldAlert, Sparkles, Filter, Download } from "lucide-react";

export default function ManageDieticianSession() {
  const [config, setConfig] = useState({
    price: 149,
    slotsLeft: 10,
  });
  const [registrations, setRegistrations] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [slotsInput, setSlotsInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchConfig();
    fetchRegistrations();
  }, []);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await getDieticianConfig();
      setConfig(res.data);
      setPriceInput(res.data.price);
      setSlotsInput(res.data.slotsLeft);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load session settings");
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await getDieticianRegistrations();
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
      const response = await downloadDieticianRegistrations();
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dietician-session-registrations.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download registrations");
    }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    if (priceInput === "" || slotsInput === "") {
      toast.error("Price and slots count are required");
      return;
    }

    try {
      const res = await updateDieticianConfig({
        price: Number(priceInput),
        slotsLeft: Number(slotsInput),
      });
      setConfig(res.data);
      toast.success("Dietician masterclass settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (filterStatus === "ALL") return true;
    return reg.status === filterStatus;
  });

  const totalEarnings = registrations
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-600" /> Dietician Session Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure pricing, manage slots, and track masterclass registrations.
          </p>
        </div>
        <button
          onClick={() => {
            fetchConfig();
            fetchRegistrations();
          }}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
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
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Price</div>
            <div className="text-2xl font-extrabold text-gray-800">₹{config.price}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Early Bird Slots Left</div>
            <div className="text-2xl font-extrabold text-gray-800">{config.slotsLeft}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Paid Registrations</div>
            <div className="text-2xl font-extrabold text-gray-800">
              {registrations.filter((r) => r.status === "PAID").length}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earnings</div>
            <div className="text-2xl font-extrabold text-gray-800">₹{totalEarnings}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ⚙️ Live Price Settings Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Update Pricing & Slots
          </h3>
          <form onSubmit={handleUpdateConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Masterclass Price (₹)
              </label>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="e.g. 149"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm font-semibold transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                *Directly updates early bird or regular pricing on the signup page.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Slots Count
              </label>
              <input
                type="number"
                value={slotsInput}
                onChange={(e) => setSlotsInput(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm font-semibold transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                *The signup page ticker will display this remaining slot count.
              </p>
            </div>

            <button
              type="submit"
              disabled={loadingConfig}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              {loadingConfig ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* 📋 Registrations List Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-800">
              Registrations List ({filteredRegistrations.length})
            </h3>
            
            {/* Filters and Download */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 focus:outline-none bg-white"
                >
                  <option value="ALL">All Payments</option>
                  <option value="PAID">Paid Only</option>
                  <option value="PENDING">Pending Only</option>
                </select>
              </div>
              <button
                onClick={handleDownloadExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingRegs ? (
              <div className="p-12 text-center text-gray-400 text-sm font-semibold">
                Loading registrations...
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm font-semibold">
                No registrations found matching the criteria.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">Name / Contact</th>
                    <th className="p-4">Challenge</th>
                    <th className="p-4">Promo</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors text-xs font-semibold text-gray-700">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{reg.name}</div>
                        <div className="text-gray-400 text-[10px]">{reg.phone}</div>
                        <div className="text-gray-400 text-[10px]">{reg.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {reg.challenge || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        {reg.promocode ? (
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {reg.promocode}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900">
                        ₹{reg.amount}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                            reg.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {reg.status}
                        </span>
                        {reg.paymentId && (
                          <div className="text-[9px] text-gray-400 font-mono mt-1">
                            {reg.paymentId}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 text-[10px]">
                        {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
