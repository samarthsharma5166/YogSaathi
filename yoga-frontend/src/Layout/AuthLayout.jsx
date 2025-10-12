import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 h-64 md:h-auto hidden md:block">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          src="/register.jpg"
          alt="Yoga background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Message */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 text-center">
        {/* <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2e7d32] mb-4"
        >
          🚧 We're Working on Something Exciting!
        </motion.h1> */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl"
        >
          Our registration page is under development and will be launching soon.
          Stay tuned for updates and be the first to join our wellness journey.{" "}
          <br />
          🔔 Follow us or check back shortly!
        </motion.p> */}

        {/* Uncomment below when ready to render registration form */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
