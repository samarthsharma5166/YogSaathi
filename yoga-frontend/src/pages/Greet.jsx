import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Greet = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="text-green-600 w-16 h-16" />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          You're Registered!
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Thank you for signing up. We're excited to have you on board. <br />
          We’ll contact you shortly with more details.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="/"
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Go to Homepage
          </a>
          <a
            href="/auth/login"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Greet;
