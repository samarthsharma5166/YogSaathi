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
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <FiAlertTriangle className="text-7xl text-yellow-500 mx-auto" />
                        <h1 className="text-4xl font-bold text-gray-800 mt-6">{status === 'no_ref' ? 'Invalid Link' : 'Class Not Open'}</h1>
                        <p className="text-lg text-gray-500 max-w-md mx-auto">{errorMessage}</p>
                        <Link
                            to="/"
                            className="mt-8 inline-block bg-[#607957] hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
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