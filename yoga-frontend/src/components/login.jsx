import React, { useState } from "react";
import {  sentOtp, verifyOtp } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
// import PhoneInput from "react-phone-input-2";
import CustomPhoneInput from "./CustomPhoneInput";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ phoneNumber: "", otp: "" });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async(e) => {
    e.preventDefault();

    if (!form.phoneNumber) {
      toast.error("Please enter your phone number.");
      return;
    }

    try{
    await sentOtp(form);
      setStep(2);
    }catch(err){
      console.log(err);
      alert(err.response.data.message || err.response.data.error || "Login failed.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    if(form.otp.length < 6 || form.otp.length >6){
      toast.error("Please enter a valid OTP.");
      return;
    }

    try {
      const res = await verifyOtp(form);
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful");

      if (user.role === "admin") {
        navigate("/admin/admin-dashboard");
      } else if (user.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message || err.response.data.error || "Login failed.");
      alert("Login failed. Invalid OTP or number.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={step === 1 ? handleSendOtp : handleLogin} className="space-y-4">
          <section>
            <span>
              {/* <PhoneInput
                country={"in"}
                enableSearch={true}
                placeholder="Enter phone number"  
                value={form.phoneNumber}  
                onChange={(value) => setForm({ ...form, phoneNumber: `+${value}` })}
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                  // className: "w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                }}
              /> */}
              <CustomPhoneInput
                value={form.phoneNumber}
                onChange={(value) => setForm({ ...form, phoneNumber: value })}
                placeholder="Enter phone number"
              />
            </span>
          </section>
          {step === 2 && (
            <input
              name="otp"
              type="text"
              onChange={handleChange}
              value={form.otp}
              placeholder="Enter OTP"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}

          <button
            type="submit"
            className="w-full !bg-green-600 !text-white font-semibold py-3 rounded-md transition duration-300"
          >
            {step === 1 ? "Send OTP" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
