// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import { getClassLink } from "../services/api";

// const JoinClass = () => {
//     const location = useLocation();
//     const [loading, setLoading] = useState(true);
//     const [classFound, setClassFound] = useState(false);

//     // extract ?ref=something
//     const queryParams = new URLSearchParams(location.search);
//     const referralCode = queryParams.get("ref")?.split("_")[0];

//     useEffect(() => {
//         const fetchClass = async () => {
//             try {
//                 if (!referralCode) {
//                     setLoading(false);
//                     return;
//                 }

//                 const res = await getClassLink(referralCode);
//                 const data = await res.data;

//                 if (data?.link) {
//                     setClassFound(true);
//                     window.location.href = data.link; // 🔀 redirect
//                 } else {
//                     setClassFound(false);
//                 }
//             } catch (error) {
//                 console.error("Error fetching class:", error);
//                 setClassFound(false);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchClass();
//     }, [referralCode]);

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-50">
//             {loading ? (
//                 // 🔄 Modern Loader
//                 <motion.div
//                     className="flex gap-3"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.6 }}
//                 >
//                     {[0, 1, 2].map((i) => (
//                         <motion.span
//                             key={i}
//                             className="w-6 h-6 bg-[#607957] rounded-full"
//                             animate={{ y: [0, -15, 0] }}
//                             transition={{
//                                 repeat: Infinity,
//                                 duration: 0.6,
//                                 delay: i * 0.2,
//                             }}
//                         />
//                     ))}
//                 </motion.div>
//             ) : !classFound ? (
//                 // ❌ Animated error message
//                 <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ duration: 0.5, type: "spring" }}
//                     className="text-red-600 text-3xl font-bold"
//                 >
//                     🚫 Class will commence at scheduled timing
//                 </motion.div>
//             ) : (
//                 <div className="relative w-full pb-[56.25%] text-center">
//                     <h1 className="text-xl font-semibold">
//                         We are redirecting you to the class...
//                     </h1>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default JoinClass;


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getClassLink } from "../services/api";

const JoinClass = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [classFound, setClassFound] = useState(false);
    const [streamHtml, setStreamHtml] = useState("");

    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get("ref")?.split("_")[0];

    useEffect(() => {
        const fetchClass = async () => {
            try {
                if (!referralCode) {
                    setLoading(false);
                    return;
                }

                const res = await getClassLink(referralCode);
                const data = await res.data;
        
                if (data?.link) {
                    setClassFound(true);
                    console.log(data.link)
                    setStreamHtml(data.link);
                } else {
                    setClassFound(false);
                }
            } catch (error) {
                console.error("Error fetching class:", error);
                setClassFound(false);
            } finally {
                setLoading(false);
            }
        };

        fetchClass();
    }, [referralCode]);

    // Extract iframe src from HTML string
    const extractIframeSrc = (html) => {
        const match = html?.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    };

    const iframeSrc = extractIframeSrc(streamHtml);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {loading ? (
                // 🔄 Loading State
                <div className="flex flex-col justify-center items-center min-h-screen">
                    <motion.div
                        className="flex gap-3 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-5 h-5 bg-[#607957] rounded-full"
                                animate={{ y: [0, -15, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 text-lg"
                    >
                        Loading class...
                    </motion.p>
                </div>
            ) : !classFound ? (
                // ❌ Error State
                <div className="flex justify-center items-center min-h-screen px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                        >
                            <span className="text-5xl">🚫</span>
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                            Class Not Available
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Class will commence at scheduled timing
                        </p>
                    </motion.div>
                </div>
            ) : (
                // ✅ Stream Display
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto px-4 py-6 md:py-8 max-w-7xl"
                >
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Live Class
                            </h1>
                        </div>
                        <p className="text-gray-600">Your session is now active</p>
                    </motion.div>

                    {/* Video Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Aspect Ratio Container */}
                        <div className="relative w-full pb-[56.25%]">
                            {iframeSrc && (
                                <iframe
                                    src={iframeSrc}
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{ border: 'none' }}
                                    scrolling="no"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title="Live Class Stream"
                                />
                            )}
                        </div>

                        {/* Decorative Border */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#607957] via-[#7a9a6f] to-[#607957]"></div>
                        </div>
                    </motion.div>

                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#607957] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-semibold text-gray-800">Live Now</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#607957] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Mode</p>
                                <p className="font-semibold text-gray-800">Interactive</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#607957] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Quality</p>
                                <p className="font-semibold text-gray-800">HD Stream</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default JoinClass;