import React, { useState, useEffect } from "react";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import  "react-phone-input-2/lib/style.css";
import "./input.css"
import CustomPhoneInput from "./CustomPhoneInput";
import {motion} from 'framer-motion'
import { FaSpinner } from "react-icons/fa";


function Register() {
  const navigate = useNavigate();
  const [loading,setLoading] = useState();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    referredByCode: "",
  });

  const [refferalInfo, setRefferalInfo] = useState({
    name:"",
    refferal_count:0
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    const name = params.get("name");
    const referral_count = params.get("refferal_count");
    if (ref) {
      setForm((prev) => ({ ...prev, referredByCode: ref }));
      setRefferalInfo({
        name:name,
        refferal_count:referral_count
      })
    }
  }, []);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === "referred_by"){
      const params = new URLSearchParams(window.location.search);
      params.set("ref", e.target.value);
      window.history.replaceState(null, "", `?${params.toString()}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name  || !form.phoneNumber ) {
        toast.error("Please fill in all fields.");
        return;
      }
      const nameRegex = /^[a-zA-Z\s]{2,50}$/;
      if (!nameRegex.test(form.name)) {
        toast.error("Name should be between 2 and 50 characters.");
        return;
      }

      if(form.phoneNumber.length < 10){
        toast.error("Phone number should be 10 digits long.");
        return;
      }
      setLoading(true);
      const res = await registerUser(form);
      const data = res.data;
      if(data.success){
        toast.success("Registered successfully");
        setLoading(false);
        navigate("/auth/greet");
      }
    } catch (err) {
      setLoading(false)
      console.error("Register error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || err.response?.data?.message);
     
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen min-w-screen">
      <FaSpinner className="animate-spin"/>
    </div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 ">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Register with <span className="font-bold text-green-500 ">yogsaathi</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            onChange={handleChange}
            placeholder="Name*"
            value={form.name}
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            value={form.email}
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <CustomPhoneInput
              value={form.phoneNumber}
              onChange={(value) => setForm({ ...form, phoneNumber: value })}
              placeholder="Enter phone number*"
            />

          {form.referredByCode && <input
            name="referredByCode"
            type="text"
            placeholder="referral code"
            onChange={handleChange}
            value={form.referredByCode}
            // readOnly
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />}
          {refferalInfo.name && form.referred_by && <div className="w-full overflow-hidden whitespace-nowrap">
            <p className="text-xs text-red-600 animate-marquee">
              You are getting a referral from {refferalInfo.name}. They have referred {refferalInfo.refferal_count} people.
            </p>
          </div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
