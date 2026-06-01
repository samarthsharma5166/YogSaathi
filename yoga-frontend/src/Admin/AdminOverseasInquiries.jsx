import React, { useEffect, useState } from "react";
import { getOverseasInquiries } from "../services/api";
import { Search, Download, Calendar, Mail, Phone, Globe, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react";

const AdminOverseasInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null); // For goal viewer modal

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await getOverseasInquiries();
      if (response.data && response.data.success) {
        setInquiries(response.data.inquiries);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching overseas inquiries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filter inquiries based on search query
  const filteredInquiries = inquiries.filter((inq) => {
    const query = searchQuery.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(query) ||
      inq.country?.toLowerCase().includes(query) ||
      inq.email?.toLowerCase().includes(query) ||
      inq.whatsapp?.toLowerCase().includes(query) ||
      inq.healthGoal?.toLowerCase().includes(query)
    );
  });

  // Client-side CSV Exporter
  const handleCSVDownload = () => {
    if (inquiries.length === 0) return;

    const headers = ["Inquiry Date", "Full Name", "Country of Residence", "Preferred Timing (IST)", "WhatsApp Number", "Email Address", "Planned Joining Date", "Health Goal"];
    const rows = filteredInquiries.map((inq) => [
      new Date(inq.createdAt).toLocaleString("en-IN"),
      inq.name,
      inq.country,
      inq.timings,
      inq.whatsapp,
      inq.email,
      new Date(inq.joiningDate).toLocaleDateString("en-IN"),
      inq.healthGoal || "None"
    ]);

    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `overseas-inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overseas Program Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and coordinate schedules for overseas participants</p>
        </div>
        <button
          onClick={handleCSVDownload}
          disabled={filteredInquiries.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, country, email, whatsapp number or goals..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Inquiries Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <svg className="animate-spin h-8 w-8 text-emerald-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading Inquiries...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <Globe className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="font-bold text-lg text-gray-700">No Inquiries Found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria or register a new form submission.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Timings (IST)</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joining Date</th>
                  <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Goal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-semibold text-gray-900">{inq.name}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs">
                        <Globe className="w-3.5 h-3.5" />
                        {inq.country}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {inq.timings}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                      <a href={`https://wa.me/${inq.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        {inq.whatsapp}
                      </a>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                      <a href={`mailto:${inq.email}`} className="hover:underline flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        {inq.email}
                      </a>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inq.joiningDate).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-center text-sm">
                      {inq.healthGoal ? (
                        <button
                          onClick={() => setSelectedGoal({ name: inq.name, goal: inq.healthGoal })}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Goal Viewer Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
              Health / Wellness Goal – {selectedGoal.name}
            </h3>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {selectedGoal.goal}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedGoal(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            <button
              onClick={() => setSelectedGoal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverseasInquiries;
