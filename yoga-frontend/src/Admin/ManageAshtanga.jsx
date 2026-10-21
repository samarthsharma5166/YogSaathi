import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getAshtangaRegistrations,
  downloadAshtangaRegistrations,
  handleDownloadInvoice
} from "../services/api";
import {
  Calendar,
  DollarSign,
  Users,
  Award,
  ShieldAlert,
  Sparkles,
  Filter,
  Download,
  Search,
  User,
  HeartPulse,
  Eye,
  X,
  Clock,
  Briefcase
} from "lucide-react";

export default function ManageAshtanga() {
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalReg, setActiveModalReg] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await getAshtangaRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Ashtanga registrations");
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await downloadAshtangaRegistrations();
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ashtanga-registrations.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download CSV");
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesStatus = filterStatus === "ALL" || reg.status === filterStatus;
    const matchesFormat = filterFormat === "ALL" || reg.sessionType === filterFormat;
    const matchesSearch =
      !searchTerm ||
      reg.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone?.includes(searchTerm) ||
      reg.countryOfResidence?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesFormat && matchesSearch;
  });

  const totalEarningsUsd = registrations
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const paidCount = registrations.filter((r) => r.status === "PAID").length;
  const individualPaid = registrations.filter((r) => r.status === "PAID" && r.sessionType === "individual").length;
  const groupPaid = registrations.filter((r) => r.status === "PAID" && r.sessionType === "group").length;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#27500A]" /> Ashtanga Primary Series Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track Ashtanga Yoga registrations, participant safety declarations, payments, and invoices.
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
          <div className="p-3 bg-green-50 text-green-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue (USD)</div>
            <div className="text-2xl font-extrabold text-gray-900">${totalEarningsUsd.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Paid Bookings</div>
            <div className="text-2xl font-extrabold text-gray-900">{paidCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">1-on-1 vs Group</div>
            <div className="text-2xl font-extrabold text-gray-900">
              {individualPaid} <span className="text-xs text-gray-400 font-medium">/ {groupPaid}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registrations</div>
            <div className="text-2xl font-extrabold text-gray-900">{registrations.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Download Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:border-green-600 focus:outline-none w-48 sm:w-60"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</span>
              <div className="flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                {["ALL", "PAID", "PENDING"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                      filterStatus === status
                        ? "bg-white text-green-700 shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Format */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Format:</span>
              <div className="flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                {[
                  { label: "All", val: "ALL" },
                  { label: "1-on-1", val: "individual" },
                  { label: "Group", val: "group" }
                ].map((fmt) => (
                  <button
                    key={fmt.val}
                    onClick={() => setFilterFormat(fmt.val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                      filterFormat === fmt.val
                        ? "bg-white text-green-700 shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#27500A] hover:bg-[#1a3806] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer self-start lg:self-auto"
          >
            <Download className="w-3.5 h-3.5" /> Export to CSV
          </button>
        </div>

        {/* Registrations List Table */}
        <div className="overflow-x-auto">
          {loadingRegs ? (
            <div className="py-20 text-center text-xs text-gray-500 font-semibold animate-pulse">
              Loading Ashtanga registrations...
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
                  <th className="py-3.5 px-4">Country & Timezone</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Package Plan</th>
                  <th className="py-3.5 px-4">Health Limitation</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Details</th>
                  <th className="py-3.5 px-4 text-center">Invoice</th>
                  <th className="py-3.5 px-6">Booked Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{reg.customerName}</div>
                      {reg.occupation && (
                        <div className="text-[10px] text-gray-400 mt-0.5">{reg.occupation}</div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div>{reg.phone}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{reg.email}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-800">{reg.countryOfResidence || "—"}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{reg.timezone || "—"}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#27500A]">
                        {reg.sessionType === "individual" ? "1-on-1 Class" : "Group Class"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{reg.planName}</div>
                      <div className="text-[10px] text-gray-400">{reg.classesCount} Classes (1 Hour each)</div>
                    </td>

                    <td className="py-4 px-4">
                      {reg.hasHealthLimitation === "yes" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <HeartPulse className="w-3 h-3 text-amber-600" /> Yes (Has notes)
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">None known</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-black text-gray-900 text-sm">
                      ${reg.amount} {reg.currency}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.status === "PAID"
                            ? "bg-green-50 text-green-700 border border-green-200/80"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveModalReg(reg)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-[#27500A] bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2 py-1 rounded-md transition cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>

                    <td className="py-4 px-4 text-center">
                      {reg.invoice ? (
                        <button
                          onClick={() => handleDownloadInvoice(reg.invoice)}
                          className="text-xs text-green-700 hover:text-green-900 font-bold hover:underline cursor-pointer"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-gray-400">
                      <div className="flex items-center gap-1 text-[11px]">
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

      {/* Detail Modal */}
      {activeModalReg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#27500A] bg-[#EAF3DE] px-2.5 py-0.5 rounded-md">
                  Participant Profile
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  {activeModalReg.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalReg(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Information Grid */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-gray-400 font-medium block">Phone:</span>
                  <strong className="text-gray-800 font-semibold">{activeModalReg.phone}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Email:</span>
                  <strong className="text-gray-800 font-semibold">{activeModalReg.email}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Date of Birth:</span>
                  <span className="text-gray-800 font-semibold">{activeModalReg.dateOfBirth || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Country of Residence:</span>
                  <span className="text-gray-800 font-semibold">{activeModalReg.countryOfResidence || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Citizenship:</span>
                  <span className="text-gray-800 font-semibold">{activeModalReg.citizenship || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Timezone:</span>
                  <span className="text-gray-800 font-semibold">{activeModalReg.timezone || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Occupation:</span>
                  <span className="text-gray-800 font-semibold">{activeModalReg.occupation || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Job Type:</span>
                  <span className="text-gray-800 font-semibold">{activeModalReg.jobType || "—"}</span>
                </div>
              </div>

              {/* Health Notes */}
              <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/60 space-y-1.5">
                <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-amber-700" /> Health & Safety Declaration
                </div>
                <div className="text-gray-700">
                  Limitation Status: <strong>{activeModalReg.hasHealthLimitation === "yes" ? "Yes / Not Sure" : "No known limitation"}</strong>
                </div>
                {activeModalReg.healthDetails && (
                  <div className="pt-1 text-gray-700 bg-white p-2.5 rounded-xl border border-amber-200 text-xs leading-relaxed">
                    <strong>Participant Notes:</strong> {activeModalReg.healthDetails}
                  </div>
                )}
              </div>

              {/* Package & Payment */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Plan:</span>
                  <strong className="text-gray-900">{activeModalReg.planName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format:</span>
                  <strong className="text-gray-900">{activeModalReg.sessionType === "individual" ? "1-on-1 Class" : "Group Class"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <strong className="text-green-800 text-sm font-black">${activeModalReg.amount} {activeModalReg.currency}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <strong className="text-gray-900">{activeModalReg.status}</strong>
                </div>
                {activeModalReg.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Razorpay Payment ID:</span>
                    <span className="font-mono text-gray-700">{activeModalReg.paymentId}</span>
                  </div>
                )}
                {activeModalReg.orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Razorpay Order ID:</span>
                    <span className="font-mono text-gray-700">{activeModalReg.orderId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {activeModalReg.invoice && (
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(activeModalReg.invoice)}
                  className="px-4 py-2 bg-[#27500A] hover:bg-[#1a3806] text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Invoice
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveModalReg(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
