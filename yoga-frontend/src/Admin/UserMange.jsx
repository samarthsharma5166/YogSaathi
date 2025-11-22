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
import { Search, Users, Filter, Eye, Trash2, UserPlus } from "lucide-react";

const userType = {
  "ALL": "ALL",
  "ADMIN": "Admin",
  "Active-Free-Trial":"Active Free Trial",
  "Inactive-Free-Trial":"Inactive Free Trial",
  "Active-Subscribers":"Active Subscribers",
  "Inactive-Subscribers":"Inactive Subscribers",
}

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(userType.ALL);
  const [deleteModal,setDeleteModal]=useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filter, startDate, endDate]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersFromDb(filter, startDate, endDate);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to fetch users.");
    }
  };

  const handleDeletePopUp = async (id) => {
    setSelectedUser(id);  
    setDeleteModal(true);
  };

  const handleDeleteUser=async()=>{
    try {
      const res = await deleteUser(selectedUser);
      if(res.success){
        setDeleteModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || err.response?.data?.message);
    }
  }


  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
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


  return (
    <div className=" bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {deleteModal && <ConfirmationPopUp confirmHandler={handleDeleteUser} closeHandler={()=>setDeleteModal(false)}/>}
      <div className="bg-white flex justify-between rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ">Manage Users</h2>

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
          {/* <option value="Subscribed">{userType.SUBSCRIBED}</option> */}

            <option value="Inactive-Free-Trial">{userType["Inactive-Free-Trial"]}</option>
            <option value="Active-Subscribers">{userType["Active-Subscribers"]}</option>
            <option value="Inactive-Subscriber">{userType["Inactive-Subscribers"]}</option>

        </select>
      </div>
      </div>
        <div className="flex justify-between gap-2 mb-2">
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
            <label className="text-sm font-medium text-gray-700">Start Date: </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm font-medium"
              />
                    </div>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Filter
          </button>
        </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full !pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
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
                          onClick={() => handleDeletePopUp(user.id)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors group"
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
