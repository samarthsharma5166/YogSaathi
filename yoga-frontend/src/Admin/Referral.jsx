import React, { useEffect, useState } from "react";
import { RefferalStats } from "../services/api";
import Divider from '@mui/material/Divider';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";

const Referral = () => {
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchReferralStats = async () => {
    try {
      const res = await RefferalStats(userId);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching referral stats:", err);
    }
  };


  useEffect(() => {
    if (userId) {
      fetchReferralStats();
    }
  }, [userId]);

  if (!stats) return <p>Loading referral info...</p>;
  const referralLink = `${window.location.origin}/auth/register?ref=${stats.referral_code}&refferal_count=${stats.referral_count}&name=${user.name}`;

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 mb-6">
      <h1 className="bg-white rounded-xl shadow-lg !p-6 !mb-6 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Referral Information</h1>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
        {/* Total Referrals */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Referrals</h4>
          <p className="text-3xl font-bold text-blue-900">{stats.referral_count}</p>
        </div>

        {/* Referral Points */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Total Referral Points</h4>
          <p className="text-3xl font-bold text-yellow-900">{user.referralPoints}</p>
        </div>
      </div>
      <Divider/>

      <div className="gap-4 mt-4">
        <p className="text-lg font-semibold text-gray-800 mb-2">Your Referral Link</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            value={referralLink}
            readOnly
            className="w-full sm:w-auto flex-1 border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCopy}
            style={{ backgroundColor: copied ? "green" : "blue" , color: "white"}}
            className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
            title="Copy to clipboard"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      
      


      <div className="gap-4 mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Referral Stats</h4>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor:"antiquewhite" }} >id</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor:"antiquewhite" }} >name</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor:"antiquewhite" }} >email</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize:"16px", backgroundColor:"antiquewhite" }} >Phone number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.referredUsers.length <= 0 ? 
            <TableRow>
              <TableCell xs={4} colSpan={4} sx={{ textAlign: "center",fontSize: "20px" }}>
                No referrals yet.
              </TableCell>
            </TableRow> : stats.referredUsers.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell sx={{ fontWeight: "semibold", fontSize:"16px" }} >{referral.id}</TableCell>
                <TableCell sx={{ fontWeight: "semibold", fontSize:"16px" }} >{referral.name}</TableCell>
                <TableCell sx={{ fontWeight: "semibold", fontSize:"16px" }} >{referral.email}</TableCell>
                <TableCell sx={{ fontWeight: "semibold", fontSize:"16px" }} >{referral.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-***')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
    </div>
  );
};

export default Referral;
