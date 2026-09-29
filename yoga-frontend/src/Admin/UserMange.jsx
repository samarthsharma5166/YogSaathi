// 📁 src/pages/Admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import {
  updateUserById,
  getAllUsersFromDb,
  deleteUser,
} from "../services/api.js";
import toast from "react-hot-toast";
import { CiEdit, CiTrash } from "react-icons/ci";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ConfirmationPopUp from "../components/ConfirmationPopUp.jsx";
import {
  Search,
  Users,
  Filter,
  Eye,
  Trash2,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Sparkles,
  Shield,
  UserX,
  RefreshCw
} from "lucide-react";

const userType = {
  "ALL": "ALL",
  "ADMIN": "Admin",
  "Active-Free-Trial": "Active Free Trial",
  "Inactive-Free-Trial": "Inactive Free Trial",
  "Active-Subscribers": "Active Subscribers",
  "Inactive-Subscribers": "Inactive Subscribers",
  "Active-Trial-And-Subscribers": "Active Free Trial & Active Subscribers",
  "Dietician-Registrants": "Dietician Session Registrants",
  "Free-Trial-And-Dietician-Registrants": "Free Trial & Dietician Session Registrants",
  "Dietician-Leads": "Dietician Session Leads",
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filter, startDate, endDate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsersFromDb(filter, startDate, endDate);
      setUsers(res.data.users || []);
      if (res.data.counts) {
        setCounts(res.data.counts);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilter("ALL");
    setSearch("");
  };

  const handleDeletePopUp = (user) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(selectedUser.id);
      if (res && res.success) {
        setDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneNumber?.includes(search)
  );

  const getStatusBadge = (role) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (role?.toLowerCase()) {
      case 'subscribed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'freetrial':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'admin':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const statCards = [
    { key: "ALL", label: "All Users", icon: Users, color: "text-gray-700", activeBg: "border-green-600 bg-green-50/70" },
    { key: "Active-Free-Trial", label: "Active Free Trial", icon: Clock, color: "text-amber-700", activeBg: "border-amber-600 bg-amber-50/70" },
    { key: "Active-Subscribers", label: "Active Subscribers", icon: CheckCircle2, color: "text-emerald-700", activeBg: "border-emerald-600 bg-emerald-50/70" },
    { key: "Inactive-Free-Trial", label: "Inactive Free Trial", icon: AlertCircle, color: "text-orange-700", activeBg: "border-orange-600 bg-orange-50/70" },
    { key: "Inactive-Subscribers", label: "Inactive Subscribers", icon: UserX, color: "text-rose-700", activeBg: "border-rose-600 bg-rose-50/70" },
    { key: "Active-Trial-And-Subscribers", label: "Active Trial & Paid", icon: Sparkles, color: "text-teal-700", activeBg: "border-teal-600 bg-teal-50/70" },
    { key: "Dietician-Registrants", label: "Dietician Regs", icon: Sparkles, color: "text-blue-700", activeBg: "border-blue-600 bg-blue-50/70" },
    { key: "Dietician-Leads", label: "Dietician Leads", icon: PhoneCall, color: "text-purple-700", activeBg: "border-purple-600 bg-purple-50/70" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {deleteModal && (
        <ConfirmationPopUp
          title="Delete User Account"
          message={`Are you sure you want to delete "${selectedUser?.name || "this user"}" (${selectedUser?.email || selectedUser?.phoneNumber || "No contact info"})?`}
          subMessage="⚠️ This will permanently remove all associated subscriptions, attendance records, blogs, and payment transactions. This action cannot be undone."
          confirmText="Delete User"
          cancelText="Cancel"
          isLoading={isDeleting}
          isDanger={true}
          confirmHandler={handleDeleteUser}
          closeHandler={() => {
            if (!isDeleting) {
              setDeleteModal(false);
              setSelectedUser(null);
            }
          }}
        />
      )}

      {/* Header Section */}
      <div className="bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl shadow-xs border border-gray-200 p-5 mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Manage Users
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Filter, search, and manage all users and membership statuses
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="w-full md:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-2xs focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm font-semibold cursor-pointer hover:border-green-400 transition-colors"
          >
            <option value="ALL">All Users ({counts["ALL"] ?? users.length})</option>
            <option value="Active-Free-Trial">Active Free Trial ({counts["Active-Free-Trial"] ?? 0})</option>
            <option value="Active-Subscribers">Active Subscribers ({counts["Active-Subscribers"] ?? 0})</option>
            <option value="Inactive-Free-Trial">Inactive Free Trial ({counts["Inactive-Free-Trial"] ?? 0})</option>
            <option value="Inactive-Subscribers">Inactive Subscribers ({counts["Inactive-Subscribers"] ?? 0})</option>
            <option value="Active-Trial-And-Subscribers">Active Trial & Subscribers ({counts["Active-Trial-And-Subscribers"] ?? 0})</option>
            <option value="Dietician-Registrants">Dietician Registrants ({counts["Dietician-Registrants"] ?? 0})</option>
            <option value="Free-Trial-And-Dietician-Registrants">Free Trial & Dietician ({counts["Free-Trial-And-Dietician-Registrants"] ?? 0})</option>
            <option value="Dietician-Leads">Dietician Leads ({counts["Dietician-Leads"] ?? 0})</option>
            <option value="ADMIN">Admin ({counts["ADMIN"] ?? 0})</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Counts Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-6">
        {statCards.map((item) => {
          const Icon = item.icon;
          const isSelected = filter === item.key;
          const count = counts[item.key] ?? (item.key === "ALL" ? users.length : 0);

          return (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "ring-2 ring-green-600 border-green-600 bg-green-50/80 shadow-xs scale-[1.02]"
                  : "bg-gray-50/60 hover:bg-white hover:border-gray-300 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[11px] font-bold truncate ${isSelected ? "text-green-900" : "text-gray-600"}`}>
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-green-600" : "text-gray-400"}`} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-black ${isSelected ? "text-green-950" : "text-gray-900"}`}>
                  {count}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">users</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Date Range & Actions Filter Bar */}
      <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-3.5 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-2xs focus:ring-2 focus:ring-green-500 text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-2xs focus:ring-2 focus:ring-green-500 text-xs font-medium"
            />
          </div>

          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="px-4 py-1.5 bg-green-600 text-white rounded-lg shadow-2xs hover:bg-green-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            Filter Dates
          </button>

          {(startDate || endDate || filter !== "ALL" || search) && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 text-xs font-semibold transition-all cursor-pointer"
            >
              Reset All
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          Current Filter: <span className="text-green-700">{userType[filter] || filter}</span> ({filteredUsers.length} shown)
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3.5 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full !pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      {/* <div className="overflow-x-auto shadow-lg rounded-xl border">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Referred By</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phoneNumber}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.referredBy?.name || "—"}</td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={()=>navigate("/admin/user/"+user.id)}
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                  >
                    <AiOutlineEye size={20} />
                  </button>
                  
                  <button
                    onClick={() => handleDeletePopUp(user.id)}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600"
                  >
                    <CiTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred By
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                  >
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-medium text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{user.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phoneNumber || '—'}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>

                    {/* Referred By */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.referredBy?.name ? (
                        <span className="text-gray-900">{user.referredBy.name}</span>
                      ) : (
                        <span className="italic">Direct signup</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick = {()=>navigate("/admin/user/"+user.id)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors group"
                          title="View user details"
                        >
                          <Eye size={16} className="group-hover:scale-110 transition-transform" />
                        </button>

                        <button
                          onClick={() => handleDeletePopUp(user)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors group cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
                      <p className="text-sm text-gray-500">
                        {search ? 'Try adjusting your search criteria.' : 'No users match the current filter.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* --- View Modal --- */}
    
    </div>
  );
};

export default ManageUsers;
