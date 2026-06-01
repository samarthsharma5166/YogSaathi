import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-green-50/30">
      {/* Left Side Image - Stretches automatically to match form height */}
      <div className="hidden md:block md:w-1/2 relative">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          src="/auth2.jpeg"
          alt="Yoga background"
          className=" inset-0 w-full h-full object-cover"
        />
        {/* Subtle overlay to make the image look richer */}
        <div className="absolute inset-0 bg-green-900/10 mix-blend-multiply"></div>
      </div>

      {/* Right Side Form (Outlet) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center bg-gray-50 relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]">
        {/* The Outlet renders your Register/Login components */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
