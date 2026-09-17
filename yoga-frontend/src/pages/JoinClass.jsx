import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getClassLink } from "../services/api";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const JoinClass = () => {
    const location = useLocation();
    const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error', 'no_ref'
    const [errorMessage, setErrorMessage] = useState("");

    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get("ref")?.split("_")[0];

    useEffect(() => {
        if (!referralCode) {
            setStatus("no_ref");
            setErrorMessage("This link seems to be invalid. Please check the URL.");
            return;
        }

        const fetchClass = async () => {
            try {
                const res = await getClassLink(referralCode);
                const data = res.data;

                if (data?.link) {
                    setStatus("success");
                    setTimeout(() => {
                        window.location.href = data.link;
                    }, 1500);
                } else {
                    setStatus("error");
                    setErrorMessage(data.message || "The class is not open yet. Please try again closer to the start time.");
                }
            } catch (error) {
                console.error("Error fetching class:", error);
                setStatus("error");
                setErrorMessage(error.response?.data?.message || "We couldn't find an active class right now.");
            }
        };

        // Adding a small delay to show the loader, improving perceived performance
        const timer = setTimeout(fetchClass, 1000);

        return () => clearTimeout(timer);
    }, [referralCode]);

    const Loader = () => (
        <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto">
            <motion.circle
                cx="50"
                cy="50"
                r="10"
                fill="#607957"
                animate={{
                    r: [10, 25, 10],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
        </svg>
    );

    const StatusContent = () => {
        switch (status) {
            case "loading":
                return (
                    <>
                        <Loader />
                        <h1 className="text-4xl font-bold text-gray-800 mt-6">Preparing your class</h1>
                        <p className="text-lg text-gray-500">Get ready to find your balance.</p>
                    </>
                );
            case "success":
                return (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <FiCheckCircle className="text-7xl text-green-500 mx-auto" />
                        <h1 className="text-4xl font-bold text-gray-800 mt-6">You're in!</h1>
                        <p className="text-lg text-gray-500">Redirecting you to the class...</p>
                    </motion.div>
                );
            case "error":
            case "no_ref":
                return (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-xl mx-auto w-full px-4"
                    >
                        <FiAlertTriangle className="text-6xl text-amber-500 mx-auto" />
                        <h1 className="text-2xl sm:text-2xl font-bold text-gray-800 mt-4 mb-2">
                            Welcome to <span className="text-green-600">YogSaathi</span> Online Yoga Classes
                        </h1>
                        
                        <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 text-left space-y-6">
                            {/* 🇬🇧 English Section */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                                        <span>⏰</span> Please note the Class Timings:
                                    </p>
                                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs sm:text-sm font-medium text-emerald-900 space-y-1">
                                        <p><span className="font-bold">Morning:</span> 6:00 AM • 7:00 AM • 8:30 AM</p>
                                        <p><span className="font-bold">Evening:</span> 5:30 PM • 6:30 PM • 7:30 PM</p>
                                    </div>
                                </div>
                                
                                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                    <p className="font-semibold text-gray-700 flex items-start gap-1.5">
                                        <span>🔗</span>
                                        <span className="text-red-700">This link will open only at the above class timings.</span>
                                    </p>
                                    <p className="text-gray-500 pl-5">
                                        Please try opening the link at the class time.
                                    </p>
                                </div>
                            </div>

                            {/* 🌐 Divider */}
                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-3 text-gray-400 text-xs uppercase tracking-wider font-semibold">हिंदी विवरण</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            {/* 🇮🇳 Hindi Section */}
                            <div className="space-y-3">
                                <h2 className="text-lg sm:text-xl font-bold text-[#607957] border-b border-gray-100 pb-2">
                                    YogSaathi ऑनलाइन योग कक्षाओं में आपका स्वागत है
                                </h2>
                                
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                                        <span>⏰</span> कृपया योग कक्षा का समय ध्यान रखें:
                                    </p>
                                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs sm:text-sm font-medium text-emerald-900 space-y-1">
                                        <p><span className="font-bold">सुबह:</span> 6:00 बजे • 7:00 बजे • 8:30 बजे</p>
                                        <p><span className="font-bold">शाम:</span> 5:30 बजे • 6:30 बजे • 7:30 बजे</p>
                                    </div>
                                </div>
                                
                                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                    <p className="font-semibold text-gray-700 flex items-start gap-1.5">
                                        <span>🔗</span>
                                        <span className="text-red-700">यह लिंक केवल ऊपर दिए गए कक्षा के समय पर ही खुलेगा।</span>
                                    </p>
                                    <p className="text-gray-500 pl-5">
                                        कृपया कक्षा के समय पर लिंक खोलकर देखें।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="text-xs text-gray-400 mt-4">{errorMessage}</p>
                        )}
                        
                        <Link
                            to="/"
                            className="mt-6 inline-block bg-[#607957] hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            Return to Homepage
                        </Link>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <StatusContent />
            </motion.div>
        </div>
    );
};

export default JoinClass;