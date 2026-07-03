import React, { useEffect, useState, useRef } from "react";
import {
  getDieticianLeads,
  uploadDieticianLeads,
  deleteDieticianLead,
  clearDieticianLeads
} from "../services/api";
import toast from "react-hot-toast";
import {
  Search,
  Upload,
  Trash2,
  AlertCircle,
  Loader,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  XCircle
} from "lucide-react";

const DieticianLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const fileInputRef = useRef(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getDieticianLeads(page, 20, searchQuery);
      if (response.data && response.data.success) {
        setLeads(response.data.leads);
        setTotalLeads(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching dietician leads:", error);
      toast.error("Failed to load leads list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await uploadDieticianLeads(formData);
      if (response.data && response.data.success) {
        toast.success(response.data.message || "Leads uploaded successfully!");
        setPage(1);
        fetchLeads();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data?.error || "Failed to upload and parse file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await deleteDieticianLead(id);
      if (response.data && response.data.success) {
        toast.success("Lead deleted successfully.");
        fetchLeads();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead.");
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "WARNING: This will permanently delete ALL uploaded dietician leads. This action cannot be undone. Are you sure?"
      )
    ) {
      return;
    }

    try {
      const response = await clearDieticianLeads();
      if (response.data && response.data.success) {
        toast.success("All leads cleared successfully.");
        setPage(1);
        fetchLeads();
      }
    } catch (error) {
      console.error("Error clearing leads:", error);
      toast.error("Failed to clear leads list.");
    }
  };

  const getRSVPBadge = (rsvp) => {
    const cleanRsvp = String(rsvp || "").trim().toLowerCase();

    if (cleanRsvp === "yes") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Yes</span>
        </span>
      );
    } else if (cleanRsvp === "may be" || cleanRsvp === "maybe" || cleanRsvp === "may-be") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Maybe</span>
        </span>
      );
    } else if (cleanRsvp === "no") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
          <XCircle className="w-3.5 h-3.5" />
          <span>No</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-150">
          <span>{rsvp || "N/A"}</span>
        </span>
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dietician Session Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Upload interested Google Form lists and manage leads</p>
        </div>
        {leads.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Leads</span>
          </button>
        )}
      </div>

      {/* Upload and Search grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Import Spreadsheet</h2>
          <p className="text-gray-500 text-xs mb-4">Upload your .xlsx, .xls or .csv Google Form responses</p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
            id="leads-file-upload"
          />

          <label
            htmlFor="leads-file-upload"
            className={`flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm cursor-pointer transition-all shadow-sm ${
              uploading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Excel / CSV</span>
              </>
            )}
          </label>
        </div>

        {/* Search & Filter Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search leads by name, mobile, or RSVP status..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm mt-4">
            <span className="text-gray-500">Total Uploaded Leads:</span>
            <span className="font-semibold text-gray-900 text-base">{totalLeads}</span>
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-gray-500 text-sm">Loading leads list...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 text-center px-4">
            <AlertCircle className="w-12 h-12 text-gray-450 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No Leads Found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              {searchQuery
                ? "No leads matched your search query. Try typing something else!"
                : "Get started by importing your dietician session Google Form responses above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-16">Sr No</th>
                  <th className="p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Name</th>
                  <th className="p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Mobile</th>
                  <th className="p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Will Attend?</th>
                  <th className="p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Uploaded At</th>
                  <th className="p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, index) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500">{lead.srNo || (page - 1) * 20 + index + 1}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="p-4 text-sm text-gray-600">{lead.mobile || "N/A"}</td>
                    <td className="p-4 text-sm">{getRSVPBadge(lead.willAttend)}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="p-4 text-sm text-right">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-100">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-250 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-250 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DieticianLeads;
