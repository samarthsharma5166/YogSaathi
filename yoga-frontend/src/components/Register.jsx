import React, { useState, useEffect, useRef } from "react";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomPhoneInput from "./CustomPhoneInput";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSpinner,
  FaGoogle,
  FaWhatsapp,
  FaCheckCircle,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaTag
} from "react-icons/fa";
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  Heart,
  Wind,
  Zap
} from "lucide-react";
import yogaTrialHero from "../assets/yoga_trial_hero.jpg";

const testimonials = [
  {
    id: 1,
    name: "Ashish Khandwekar",
    stats: "9 reviews · 3 photos",
    time: "5 days ago",
    isNew: true,
    rating: 5,
    tag: "Mobility & Fitness",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    initials: "AK",
    avatarBg: "from-emerald-500 to-teal-700",
    text: "Started Yoga classes with YogSaathi a few weeks ago and I can already see improvements in mobility and fitness. Highly recommended."
  },
  {
    id: 2,
    name: "Deepali Maheshwari",
    stats: "6 reviews",
    time: "a day ago",
    isNew: true,
    rating: 5,
    tag: "Spine Health & Flexibility",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    initials: "DM",
    avatarBg: "from-blue-500 to-indigo-700",
    text: "Really enjoying my yoga journey with Yogsaathi! The teachers are excellent, classes are easy to follow, and with multiple time slots, it’s super convenient to stay consistent. It’s also affordable and has been really helpful for my spine health and overall well-being."
  },
  {
    id: 3,
    name: "Himanshu Rathi",
    stats: "9 reviews",
    time: "10 months ago",
    isNew: false,
    rating: 5,
    tag: "Clear Guidance & Beginners",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    initials: "HR",
    avatarBg: "from-amber-500 to-orange-700",
    text: "The instructors are fantastic and offer clear guidance for all levels. A truly welcoming and supportive place to practice."
  },
  {
    id: 4,
    name: "Milind Mangalgiri",
    stats: "3 reviews · 6 photos",
    time: "2 weeks ago",
    isNew: true,
    rating: 5,
    tag: "Calm & Composure",
    tagColor: "bg-purple-100 text-purple-800 border-purple-200",
    initials: "MM",
    avatarBg: "from-purple-500 to-pink-700",
    text: "After attending YogSaathi Yoga sessions I genuinely feel that my body movements have become lighter and more flexible, and I experience a wonderful sense of calm and composure after my practice. YogSaathi is truly worth experiencing. I am very happy to recommend YogSaathi to others."
  }
];

const trialPerks = [
  {
    icon: Clock,
    title: "7 Daily Live Batches",
    desc: "Join any slot from 5:00 AM to 8:00 PM"
  },
  {
    icon: Activity,
    title: "Improve Flexibility & Posture",
    desc: "Interactive live guidance"
  },
  {
    icon: Heart,
    title: "Reduce Stress & Anxiety",
    desc: "Guided meditation & pranayama"
  },
  {
    icon: Zap,
    title: "Enhance Strength & Balance",
    desc: "Build core stability and stamina"
  },
  {
    icon: Wind,
    title: "Improve Breathing",
    desc: "Deeper oxygen flow and vitality"
  },
  {
    icon: ShieldCheck,
    title: "100% Free & No Card Needed",
    desc: "Instant WhatsApp link with zero charges"
  }
];

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    referredByCode: "",
  });

  const [refferalInfo, setRefferalInfo] = useState({
    name: "",
    refferal_count: 0
  });

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    const name = params.get("name");
    const referral_count = params.get("refferal_count");
    if (ref) {
      setForm((prev) => ({ ...prev, referredByCode: ref }));
      setRefferalInfo({
        name: name || "A Friend",
        refferal_count: referral_count || 1
      });
    }
  }, []);

  // Auto cycle testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    autoPlayRef.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5500);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "referred_by" || e.target.name === "referredByCode") {
      const params = new URLSearchParams(window.location.search);
      params.set("ref", e.target.value);
      window.history.replaceState(null, "", `?${params.toString()}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.phoneNumber) {
        toast.error("Please enter your name and WhatsApp number.");
        return;
      }

      const nameRegex = /^[a-zA-Z\s]{2,50}$/;
      if (!nameRegex.test(form.name.trim())) {
        toast.error("Name should be between 2 and 50 characters and contain letters only.");
        return;
      }

      if (/[0-9]/.test(form.name)) {
        toast.error("Name should not contain numbers.");
        return;
      }

      const digitsOnly = form.phoneNumber.replace(/\D/g, "");
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        toast.error("Please enter a valid phone number (at least 10 digits).");
        return;
      }

      setLoading(true);
      const res = await registerUser(form);
      const data = res.data;
      if (data.success || data.message) {
        toast.success("Registration successful! Welcome to YogSaathi 🧘");
        setLoading(false);
        navigate("/auth/greet");
      }
    } catch (err) {
      setLoading(false);
      console.error("Register error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);

      if (err.response?.data?.message === "User already exists") {
        navigate("/price");
      }
    }
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4EFEA] to-[#EAF3DE]/40 text-[#1C2623] relative overflow-hidden py-4 px-3 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#3B6D11]/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      {/* Top Header */}
      <header className="max-w-4xl mx-auto text-center mb-3 sm:mb-4 relative z-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1a3307] tracking-tight mt-10">
          14 Days Free Yoga Trial
        </h1>
        <div className="inline-flex items-center gap-1.5 mt-1 bg-[#EAF3DE] border border-emerald-200/80 text-[#27500a] px-3.5 py-0.5 rounded-full text-xs font-bold tracking-wide shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>100% Free Live Trial • No Payment Required</span>
        </div>
      </header>

      {/* Main Split Layout: Left Visual & Perks + Right Compact Registration Card */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center relative z-10 pb-4">

        {/* LEFT COLUMN: Visual Showcase & Trial Perks */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center space-y-3">

          {/* Featured Yoga Studio Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-lg border border-emerald-950/10 group"
          >
            <img
              src={yogaTrialHero}
              alt="YogSaathi Live Yoga Studio"
              className="w-full h-44 sm:h-52 md:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Live Indicator Top Left */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
              <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Online Classes
              </span>
            </div>

            {/* Overlaid Badges Bottom */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-2 text-white">
              <span className="bg-white/25 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-lg border border-white/20">
                Expert Indian Instructors
              </span>
              <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-200">
                ★ 4.9 Verified Rating
              </div>
            </div>
          </motion.div>

          {/* Quick Value Grid (Compact 6 benefits) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-2"
          >
            {trialPerks.map((perk, index) => {
              const IconComp = perk.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/80 backdrop-blur-xs border border-emerald-900/10 hover:border-emerald-300 hover:bg-white transition-all duration-200 shadow-2xs group min-h-[50px] sm:min-h-[56px]"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-100/80 text-[#27500a] flex items-center justify-center shrink-0 self-center group-hover:bg-[#27500a] group-hover:text-white transition-colors duration-200">
                    <IconComp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center self-center">
                    <h3 className="text-[11px]! sm:text-[16px]! md:text-[18px]! font-bold text-gray-900 leading-snug whitespace-normal m-0 p-0">
                      {perk.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Modern Compact Registration Form Card */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-[400px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-[#27500a]/10 border border-emerald-100/90 overflow-hidden relative"
          >
            {/* Top decorative gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#27500a] via-[#468615] to-emerald-400" />

            <div className="p-4 sm:p-5">

              {/* Form Title & Subtitle */}
              <div className="text-center mb-3">
                {/* <div className="inline-flex items-center gap-1 bg-emerald-50 text-[#27500a] border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  Instant Free Access
                </div> */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Register Free Yoga Trial
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Enter details to receive your live class link on WhatsApp
                </p>
              </div>

              {/* Referral Notice Banner (if ref params exist) */}
              {refferalInfo.name && form.referredByCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-3 p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2 shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    🎁
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold">
                      Invited by {refferalInfo.name}!
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      Your complimentary trial pass is unlocked.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="!bg-transparent !p-0 !shadow-none !border-none space-y-2.5">

                {/* Full Name Input */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center w-full h-10 px-3 rounded-lg border border-gray-300 bg-white focus-within:border-[#3B6D11] focus-within:ring-2 focus-within:ring-[#3B6D11]/20 transition-all shadow-2xs">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2.5 pointer-events-none" />
                    <input
                      name="name"
                      type="text"
                      required
                      onChange={handleChange}
                      placeholder="e.g. Aditi Sharma"
                      value={form.name}
                      className="w-full h-full bg-transparent focus:outline-none text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 !p-0 border-none outline-none"
                    />
                  </div>
                </div>

                {/* Email Address Input (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-center w-full h-10 px-3 rounded-lg border border-gray-300 bg-white focus-within:border-[#3B6D11] focus-within:ring-2 focus-within:ring-[#3B6D11]/20 transition-all shadow-2xs">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2.5 pointer-events-none" />
                    <input
                      name="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="e.g. aditi@example.com"
                      value={form.email}
                      className="w-full h-full bg-transparent focus:outline-none text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 !p-0 border-none outline-none"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone Number Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <FaWhatsapp className="text-emerald-600 text-xs" />
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                      Link sent here
                    </span>
                  </div>
                  <CustomPhoneInput
                    value={form.phoneNumber}
                    onChange={(value) => setForm({ ...form, phoneNumber: value })}
                    placeholder="Enter 10-digit number"
                  />
                </div>

                {/* Referral Code Field (Only shown when accessed via referral link) */}
                {form.referredByCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-0.5"
                  >
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Referral Code Applied
                    </label>
                    <div className="flex items-center w-full h-10 px-3 rounded-lg border border-emerald-300 bg-emerald-50/50 transition-all shadow-2xs">
                      <FaTag className="w-3 h-3 text-emerald-600 shrink-0 mr-2.5 pointer-events-none" />
                      <input
                        name="referredByCode"
                        type="text"
                        readOnly
                        value={form.referredByCode}
                        className="w-full h-full bg-transparent focus:outline-none text-xs font-semibold text-emerald-800 uppercase tracking-wider !p-0 border-none outline-none cursor-default"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Privacy Guarantee Note */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[10px] text-gray-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% privacy protected. No spam, only class link.</span>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-[#27500a] via-[#3B6D11] to-[#27500a] hover:from-[#1e3e08] hover:to-[#2e570c] text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span className="text-xs">Activating Free Trial...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide text-xs sm:text-sm">Submit</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Quick Perks */}
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  No Card Required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Instant WhatsApp Access
                </span>
              </div>

              {/* Already have an account */}
              <p className="mt-2 text-center text-[11px] text-gray-600">
                Already registered with YogSaathi?{" "}
                <Link
                  to="/auth/login"
                  className="text-[#27500a] hover:text-emerald-700 font-bold hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* BOTTOM SECTION: Few of Our Members Stories (Full-Width Testimonials Showcase) */}
      <section className="max-w-5xl mx-auto w-full mt-2 pt-6 border-t border-emerald-900/10 relative z-10 pb-6">

        {/* Section Heading */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a3307] tracking-tight">
            Few of Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27500a] via-[#3B6D11] to-emerald-600">
              Members Stories
            </span>
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-gray-600 max-w-xl mx-auto">
            Read real transformation experiences from daily practitioners who improved their flexibility, spine health, and inner peace with YogSaathi.
          </p>
        </div>

        {/* Testimonial Showcase Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-lg shadow-emerald-950/5 relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Header with Google reviews badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center shrink-0">
                <FaGoogle className="text-[#4285F4] text-xl" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                    Google Verified Reviews
                  </span>
                  <span className="text-xs sm:text-sm font-black bg-emerald-100 text-[#27500a] border border-emerald-300/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                    4.9 ★★★★★
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Real experiences from our daily practitioners</p>
              </div>
            </div>

            {/* Navigation Arrows & Slide Dots */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous review"
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <div className="flex gap-1 px-1">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${activeTestimonial === idx
                      ? "w-5 bg-[#3B6D11]"
                      : "w-1.5 bg-gray-200 hover:bg-gray-300"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next review"
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>

          {/* Testimonial Active Slide */}
          <div className="relative min-h-[120px] sm:min-h-[100px] pt-3.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2.5"
              >
                {/* Rating Stars & Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${testimonials[activeTestimonial].avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                      {testimonials[activeTestimonial].initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight">
                          {testimonials[activeTestimonial].name}
                        </h4>
                        {testimonials[activeTestimonial].isNew && (
                          <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.2 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {testimonials[activeTestimonial].stats} • {testimonials[activeTestimonial].time}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-amber-400 gap-0.5 text-xs">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                {/* Quote content */}
                <div className="relative pl-6 pr-2">
                  <FaQuoteLeft className="absolute left-0 top-1 text-emerald-300 text-xs" />
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-serif">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                </div>

                {/* Review Tag Pill */}
                <div className="flex justify-end pt-0.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${testimonials[activeTestimonial].tagColor}`}>
                    🎯 {testimonials[activeTestimonial].tag}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Reviewer Tabs to switch directly */}
          <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-gray-500 font-medium">
              Click reviewer to read their feedback:
            </span>
            <div className="flex items-center gap-1.5">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTestimonial(idx)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${activeTestimonial === idx
                    ? "bg-[#27500a] text-white shadow-xs ring-1 ring-emerald-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${t.avatarBg} text-[8px] text-white flex items-center justify-center font-bold`}>
                    {t.initials[0]}
                  </span>
                  <span>{t.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social Proof Stats footer */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">A</span>
              <span className="w-5 h-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">D</span>
              <span className="w-5 h-5 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">H</span>
              <span className="w-5 h-5 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">M</span>
            </div>
            <span className="font-semibold text-gray-800">1000+ Yogis Enrolled</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-800 font-semibold">
            <FaCheckCircle className="text-emerald-600 text-xs" />
            <span>Free 1-Day Full Class Access</span>
          </div>
        </div>

      </section>
    </div>
  );
}

export default Register;
