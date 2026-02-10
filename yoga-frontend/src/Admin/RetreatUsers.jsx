import React, { useEffect, useState } from "react";
import { getRetreatUsers, downloadRetreatUsers } from "../services/api";

const RetreatUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getRetreatUsers();
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching retreat users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await downloadRetreatUsers();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "retreat-users.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading retreat users:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Retreat Event Registrations</h1>
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download CSV
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Full Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Mobile Number</th>
                <th className="py-2 px-4 border-b">Plan</th>
                <th className="py-2 px-4 border-b">T-Shirt Size</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b">{user.fullName}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.mobileNumber}</td>
                  <td className="py-2 px-4 border-b">{user.plan}</td>
                  <td className="py-2 px-4 border-b">{user.tShirtSize}</td>
                  <td className="py-2 px-4 border-b">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RetreatUsers;
