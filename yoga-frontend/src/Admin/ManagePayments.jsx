import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { getPayment, verifyPayment } from "../services/api";

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

    useEffect(() => {
        fetchPayments();
    }, [page, search]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await getPayment(page, 10, search);
            console.log(res)
            setPayments(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (p) => {
        try {
            setVerifying(p.id);
            const res = await verifyPayment(p);
            if (res.data.success) {
                alert("✅ Payment verified successfully!");
                fetchPayments();
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Failed to verify payment");
        } finally {
            setVerifying(null);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const nextPage = () => {
        if (page < pagination.totalPages) setPage((p) => p + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Manage Payments</h1>
                <div className="relative w-72">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by name, phone, or payment ID..."
                        className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border border-gray-200 bg-white text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Plan</th>
                            <th className="p-3 text-left">Payment ID</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{p.user?.name || "N/A"}</td>
                                    <td className="p-3">{p.user?.phoneNumber || "-"}</td>
                                    <td className="p-3">{p.planId || "-"}</td>
                                    <td className="p-3">{p.razorpay_payment_id || "N/A"}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${p.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {p.status === "PENDING" ? (
                                            <button
                                                onClick={() => handleVerify(p)}
                                                disabled={verifying === p.id}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {verifying === p.id && (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                )}
                                                Verify
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">Verified</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No payments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <p>
                    Page {pagination.page || page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={page === pagination.totalPages}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagePayments;
        