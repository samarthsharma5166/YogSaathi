import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createOrder, getPlanById } from "../services/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./CSS/phoneinput.css";
import {motion} from 'framer-motion'
import toast from "react-hot-toast";
import CustomPhoneInput from "../components/CustomPhoneInput";

const CheckoutPage = () => {
    const { planId } = useParams();
    const [searchParams] = useSearchParams();
    console.log(searchParams.get("currency"))
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const restrictedDate = "2025-10-26";

    const [formData, setFormData] = useState({
        phone: "",
        name: "",
        startDate: ""
    });

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await getPlanById(planId);
                setPlan(response.data);
            } catch (error) {
                console.error("Failed to fetch plan", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [planId]);

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;

        // disable before today automatically using `min`
        if (selectedDate <= restrictedDate) {
            toast("Our first session will start from October 27, 2025", {
                icon: "🚫",
            });
            setFormData({ ...formData, startDate: "" });
            return;
        }

        setFormData({ ...formData, startDate: selectedDate });
    };

    const handleCheckout = async () => {
        try {
            // Validate required fields before calling backend
            if (!formData.phone || !formData.name || !formData.startDate) {
                toast.error("Please fill all required fields");
                return;
            }

            const orderResponse = await createOrder({
                planId,
                phoneNumber: formData.phone,
                planName: plan.name
            });

            if (orderResponse.data.success === false) {
                toast.error(orderResponse.data.message);
                return;
            }

            const order = orderResponse.data;

            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "Yoga Everyday",
                description: `${plan.name} Plan`,
                order_id: order.orderId,
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#00C853",
                },
                handler: async function (response) {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-payment`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            phoneNumber:formData.phone,
                            planId: plan.id,
                            startDate: formData.startDate
                        }),
                    });

                    const data = await res.json();
                    if (data.success) {
                        toast.success("Payment successful and verified!");
                        const token = localStorage.getItem("token");
                        const user = localStorage.getItem("user");
                        if (token && user) {
                            if (user.role === "ADMIN") {
                            navigate("/admin/admin-dashboard");
                        } else {
                            navigate("/user/dashboard");
                        }
                        }
                    } else {
                        alert("Payment verification failed");
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || "Something went wrong");
        }

    };

    if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;
    if (!plan) return <div className="text-center py-20 text-red-500">Plan not found</div>;

    const discountPrice = plan.orignalPrice - plan.inrPrice;

    return (
        <div className="min-h-screen bg-[#E8F5E9] grid place-items-center grid-cols-1 md:grid-cols-2 px-6 md:px-12 py-10 gap-8">
            {/* Plan Summary */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-green-200 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-green-700 mb-4">Yoga Everyday</h1>
                <h2 className="text-xl font-semibold text-green-800 mb-2">{plan.name} Membership</h2>
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-green-700">{searchParams.get("currency") === "USD" ? `$ ${plan.usdPrice}` :  `₹${plan.inrPrice}`}</span>
                    {discountPrice > 0 && (
                        <>
                            <span className="line-through text-gray-400 text-lg">₹{plan.orignalPrice}</span>
                            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-md">
                                Save ₹{discountPrice}
                            </span>
                        </>
                    )}
                </div>

                <ul className="text-gray-600 list-disc ml-5 mb-4">
                    <li>Move your body, calm your mind, and uplift your soul</li>
                    <li>Take a moment each day for yourself – your mind and body will thank you.</li>
                </ul>

                <p className="text-gray-700 mb-2">
                    Duration: <strong className="text-green-700">{plan.duration} {plan.durationType === "MONTH" ? "months" : "days"}</strong>
                </p>

                {plan.isFreeTrial && (
                    <div className="text-green-600 bg-green-100 rounded-md px-3 py-2 text-sm mb-4">
                        🎉 This plan comes with a free trial!
                    </div>
                )}

                <button
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl font-semibold text-lg"
                    onClick={handleCheckout}
                >
                    Click here to pay {searchParams.get("currency") === "USD" ? `$ ${plan.usdPrice}` : `₹${plan.inrPrice}`}
                </button>
            </div>

            {/* User Form */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-green-200 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-green-700 mb-4">Please fill in the below information</h1>

                <label className="text-green-800 font-medium block mb-1">WhatsApp Number <span className="text-red-500">*</span></label>
                <div className=" mb-4">
                    <CustomPhoneInput
                        value={formData.phone}
                        onChange={(phone) =>
                            setFormData((prev) => ({ ...prev, phone: `${phone}` }))
                        }
                        placeholder="Enter your phone number"
                    />
                </div>
                <label className="text-green-800 font-medium block mb-1">Name <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <label className="text-green-800 font-medium block mb-1">Start Date <span className="text-red-500">*</span></label>
                <input
                    type="date"
                    name="startDate"
                    min={today}
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none"
                    value={formData.startDate}
                    onChange={handleDateChange}
                    required
                />
            </div>
        </div>
    );
};

export default CheckoutPage;
