import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createOrder, getPlanById } from "../services/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./CSS/phoneinput.css";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CustomPhoneInput from "../components/CustomPhoneInput";
import { 
    Lock, 
    CreditCard, 
    ShieldCheck, 
    Check, 
    Calendar, 
    User, 
    ArrowLeft, 
    Sparkles, 
    Info,
    Phone
} from "lucide-react";

const CheckoutPage = () => {
    const { planId } = useParams();
    const [searchParams] = useSearchParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const restrictedDate = "2025-10-26";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toLocaleDateString("en-CA");

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
        if (selectedDate <= restrictedDate || selectedDate <= today) {
            toast("Date should be after today", {
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

            if (formData.phone.length <= 12) {
                toast.error("Please enter a valid phone number");
                return;
            }

            const orderResponse = await createOrder({
                planId,
                name: formData.name,
                phoneNumber: formData.phone,
                planName: plan.name,
                startDate: formData.startDate
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
                    color: "#3B6D11",
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
                            phoneNumber: formData.phone,
                            planId: plan.id,
                            startDate: formData.startDate
                        }),
                    });

                    const data = await res.json();
                    if (data.success) {
                        toast.success("Payment successful and verified!");
                        const token = localStorage.getItem("token");
                        const userStr = localStorage.getItem("user");
                        if (token && userStr) {
                            try {
                                const user = JSON.parse(userStr);
                                if (user && user.role === "ADMIN") {
                                    navigate("/admin/admin-dashboard");
                                } else {
                                    navigate("/user/dashboard");
                                }
                            } catch (e) {
                                console.error("Failed to parse user session", e);
                                navigate("/user/dashboard");
                            }
                        } else {
                            navigate("/auth/login");
                        }
                    } else {
                        alert("Payment verification failed");
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-70px)] bg-[#FAF8F5] grid place-items-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#3B6D11]/25 border-t-[#3B6D11] rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium text-xs">Loading checkout details...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-[calc(100vh-70px)] bg-[#FAF8F5] grid place-items-center px-6">
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-xl max-w-sm text-center space-y-3">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full grid place-items-center mx-auto">
                        <Info className="w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Plan Not Found</h1>
                    <p className="text-gray-500 text-xs">The membership plan you are trying to purchase could not be retrieved. Please check your link or select a plan from the pricing table.</p>
                    <button 
                        onClick={() => navigate("/price")}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#3B6D11] hover:underline"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> View Pricing Plans
                    </button>
                </div>
            </div>
        );
    }

    const isUSD = searchParams.get("currency") === "USD";
    const discountPrice = plan.orignalPrice - plan.inrPrice;

    // Dynamically retrieve plan features based on duration
    const getFeatures = () => {
        switch (plan.duration) {
            case 12:
                return [
                    { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
                    { main: "3 Online Yoga Consultations", sub: "Posture correction" },
                    { main: "2 Online Dietician Consultations", sub: "Certified dietician" },
                    { main: "Diet Suggestions & Support", sub: "Personalized advice" },
                    { main: "Exclusive WhatsApp Group", sub: "Daily access links" }
                ];
            case 6:
                return [
                    { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
                    { main: "2 Live Yoga Consultations", sub: "Posture correction" },
                    { main: "1 Dietician Consultation", sub: "Certified dietician" },
                    { main: "Diet Suggestions & Support", sub: "Personalized advice" },
                    { main: "Exclusive WhatsApp Group", sub: "Daily access links" }
                ];
            case 3:
                return [
                    { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
                    { main: "1 Live Yoga Consultation", sub: "Posture correction" },
                    { main: "1 Dietician Consultation", sub: "Certified dietician" },
                    { main: "Diet Suggestions & Support", sub: "Personalized advice" },
                    { main: "Exclusive WhatsApp Group", sub: "Daily access links" }
                ];
            case 1:
            default:
                return [
                    { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
                    { main: "1 Dietician Consultation", sub: "Certified dietician" },
                    { main: "Diet Suggestions & Support", sub: "Personalized advice" },
                    { main: "Exclusive WhatsApp Group", sub: "Daily access links" }
                ];
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.35,
                staggerChildren: 0.06
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
    };

    return (
        <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#FAF8F5] via-[#F4F9EE] to-[#EAF3DE] text-[#1C2623] py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-5xl w-full mx-auto">
                {/* Back Link */}
                <button
                    onClick={() => navigate("/price")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition mb-3 cursor-pointer group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Plans
                </button>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
                >
                    {/* Left Column: Form (Ordered first on mobile for immediate visibility) */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-between">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h2 className="text-lg font-bold text-gray-950">Complete Your Enrollment</h2>
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-[11px] text-gray-500">Please provide details below to activate your plan.</p>
                            </div>

                            <div className="space-y-3.5 my-2">
                                {/* Name Input */}
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                                        <User className="h-3 w-3 text-[#3B6D11]" />
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className="w-full px-3.5 py-2.5 h-10 border border-gray-300 rounded-lg bg-white text-gray-800 text-xs focus:outline-none focus:border-[#3B6D11] focus:ring-2 focus:ring-[#3B6D11]/15 transition-all duration-200 placeholder:text-gray-400"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* WhatsApp Number Input */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-[#3B6D11]" />
                                        WhatsApp Number <span className="text-red-500">*</span>
                                    </label>
                                    <CustomPhoneInput
                                        value={formData.phone}
                                        onChange={(phone) =>
                                            setFormData((prev) => ({ ...prev, phone: `${phone}` }))
                                        }
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                {/* Start Date Input */}
                                <div className="space-y-1">
                                    <label htmlFor="startDate" className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-[#3B6D11]" />
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        name="startDate"
                                        min={minDate}
                                        className="w-full px-3.5 py-2.5 h-10 border border-gray-300 rounded-lg bg-white text-gray-800 text-xs focus:outline-none focus:border-[#3B6D11] focus:ring-2 focus:ring-[#3B6D11]/15 transition-all duration-200 cursor-pointer placeholder:text-gray-400"
                                        value={formData.startDate}
                                        onChange={handleDateChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Secure transaction notice */}
                            <div className="pt-3 border-t border-gray-100 space-y-3.5">
                                <motion.button
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                    className="w-full bg-[#3B6D11] hover:bg-[#2d540d] transition-all duration-200 text-white py-3 px-5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#3B6D11]/10 hover:shadow-lg cursor-pointer"
                                    onClick={handleCheckout}
                                >
                                    <Lock className="w-3.5 h-3.5" />
                                    Pay {isUSD ? `$${plan.usdPrice}` : `₹${plan.inrPrice}`} & Secure Slot
                                </motion.button>

                                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-gray-400 text-[9px] font-semibold">
                                    <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5 text-gray-400" /> SSL Encrypted</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5 text-gray-400" /> Secure Checkout</span>
                                    <span className="flex items-center gap-1"><CreditCard className="w-2.5 h-2.5 text-gray-400" /> Razorpay</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Left Column: Plan Summary (Ordered second on mobile) */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between">
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#a3c97a]/25 shadow-xl shadow-green-900/5 h-full flex flex-col justify-between space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <span className="bg-[#EAF3DE] text-[#3B6D11] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Your Selection
                                    </span>
                                    <h1 className="text-lg font-extrabold text-[#27500a] mt-1 leading-tight font-serif">Yoga Everyday</h1>
                                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{plan.duration} {plan.duration > 1 ? "Months" : "Month"} Plan</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-400 block font-semibold">Total Due</span>
                                    <span className="text-xl font-black text-gray-900 leading-none block mt-0.5">
                                        {isUSD ? `$${plan.usdPrice}` : `₹${plan.inrPrice}`}
                                    </span>
                                    <span className="text-gray-400 text-[9px] font-bold">({plan.duration} {plan.durationType === "MONTH" ? "months" : "days"})</span>
                                </div>
                            </div>
                            
                            {plan.isFreeTrial && (
                                <div className="flex items-center gap-1.5 text-[#3B6D11] bg-[#EAF3DE] border border-[#a3c97a]/20 rounded-lg px-2.5 py-1 text-[10px] font-semibold">
                                    <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                                    <span>Free trial included!</span>
                                </div>
                            )}

                            {/* Dynamic Plan Benefits Inclusions */}
                            <div className="pt-3 border-t border-dashed border-gray-200">
                                <h3 className="text-xs font-bold uppercase text-[#3B6D11] tracking-wider mb-2.5">Plan Inclusions</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-3 gap-y-2">
                                    {getFeatures().map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <div className="w-5 h-5 bg-[#EAF3DE] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-[#3B6D11]" strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">{feature.main}</p>
                                                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-tight">{feature.sub}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutPage;
