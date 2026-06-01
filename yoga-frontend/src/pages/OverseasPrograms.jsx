import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Sparkles,
  Brain,
  Smile,
  Moon,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Check,
  Globe,
  Mail,
  Phone,
  Clock,
  Laptop
} from "lucide-react";
import heroImg from "../assets/overseas_yoga_hero.png";

const OverseasPrograms = () => {
  const formRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    timings: "",
    whatsapp: "",
    email: "",
    joiningDate: "",
    healthGoal: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.country.trim()) errors.country = "Country of residence is required";
    if (!formData.timings.trim()) errors.timings = "Preferred class timings are required";
    if (!formData.whatsapp.trim()) {
      errors.whatsapp = "WhatsApp number is required";
    }
    if (!formData.email.trim()) {
      errors.email = "E-mail address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid e-mail address";
      }
    }
    if (!formData.joiningDate) errors.joiningDate = "Planned joining date is required";
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  // Features list from user text
  const features = [
    "Live online sessions",
    "Daily sessions available",
    "Flexible timing as per participant’s convenience and time zone",
    "Sessions can be arranged even for a single participant",
    "Suitable for beginners as well as regular practitioners",
    "Combination of Yoga, Breathing Exercises, Relaxation, and Meditation",
    "Duration of each session: 45 Minutes",
    "Personalized attention and guidance"
  ];

  // Benefits list from user text
  const benefits = [
    { text: "Improved flexibility and strength", icon: <Activity className="w-5 h-5 text-emerald-600" /> },
    { text: "Reduction in stress and anxiety", icon: <Smile className="w-5 h-5 text-rose-600" /> },
    { text: "Better posture and body balance", icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" /> },
    { text: "Improved concentration and mental calmness", icon: <Brain className="w-5 h-5 text-blue-600" /> },
    { text: "Enhanced energy levels and sleep quality", icon: <Moon className="w-5 h-5 text-violet-600" /> },
    { text: "Overall physical and emotional well-being", icon: <Sparkles className="w-5 h-5 text-amber-600" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F8F2] via-white to-[#EEF5EB] overflow-x-hidden text-gray-800 pb-20">
      {/* Background Decorative Soft Gradients */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-emerald-200/20 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[45%] left-0 w-[35vw] h-[35vw] rounded-full bg-amber-100/30 blur-[90px] -z-10 pointer-events-none" />

      {/* ─── Hero Section ─── */}
      <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="great-vibes-regular text-emerald-600 block text-3xl md:text-4xl mb-1">
              Balanced Blossoms
            </span>
            <span className="text-xs tracking-widest text-emerald-800/60 font-semibold uppercase block text-center lg:text-left">
              Global Online Yoga
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 leading-tight"
          >
            Online Live Sessions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              For Overseas Participants
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Experience authentic Yoga, Breathing Practices, and Meditation from the comfort of your home — anywhere in the world. The Session Timings will be fixed as per Participants’ convenience. Please click the button on the bottom to show your interest and tell us what time is convenient for you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-base  text-emerald-800 bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 max-w-2xl mx-auto lg:mx-0 font-semibold shadow-sm leading-relaxed"
          >
            We are pleased to offer Online Live Yoga Sessions specially designed for overseas participants seeking better physical health, mental calmness, flexibility, stress reduction, and overall well-being. These Programs are available at very reasonable rates- please go to SUBSCRIPTION for pricing (Applicable in $).
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              onClick={() => scrollToSection(formRef)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-md text-center cursor-pointer"
            >
              Show Interest
            </button>
            <a
              href="/price"
              className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-full font-bold text-lg hover:border-emerald-600 hover:bg-emerald-50/50 transition-all duration-300 shadow-sm text-center cursor-pointer"
            >
              View Subscriptions ($)
            </a>
          </motion.div>
        </div>

        {/* Right side Illustration */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 to-teal-100/35 rounded-[40px] rotate-3 scale-105 -z-10" />
            <img
              src={heroImg}
              alt="Overseas Yoga Illustration"
              className="w-full h-auto rounded-[36px] shadow-2xl object-cover border border-white/50"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── Features of the Program Section ─── */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            Features of the Program
          </h2>
          <div className="h-1 bg-emerald-500 w-16 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => (
            <div>
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-gray-700 font-semibold text-base leading-relaxed">
                  {item}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Benefits Section ─── */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            Regular practice may help in:
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Discover positive health and mindful alignment benefits through regular, online guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <div>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-4"
              >
                <div className="bg-emerald-50 p-3 rounded-full border border-emerald-100">
                  {item.icon}
                </div>
                <p className="font-bold text-gray-900 text-base leading-snug">
                  {item.text}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Summary Paragraph Card ─── */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex items-center gap-6 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-emerald-500 to-teal-500" />
          <p className="text-gray-600 text-lg leading-relaxed font-semibold text-center md:text-left">
            Whether you are a working professional, homemaker, senior citizen, student, or someone looking to begin a healthier lifestyle, these sessions are designed to support your wellness journey.
          </p>
        </motion.div>
      </section>

      {/* ─── Show Interest Form ─── */}
      <section ref={formRef} className="px-6 py-16 md:py-24 max-w-3xl mx-auto scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[32px] border border-gray-100 shadow-2xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 space-y-6"
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="bg-emerald-100 p-6 rounded-full border border-emerald-200 text-emerald-600"
                >
                  <Check className="w-16 h-16" strokeWidth={3} />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-950">Interest Registered!</h3>
                  <p className="text-gray-600 text-base max-w-md">
                    Thank you, <strong className="text-emerald-700">{formData.name}</strong>! We've received your interest in our Overseas Live Sessions.
                  </p>
                  <p className="text-gray-500 text-sm max-w-md pt-2">
                    Our yoga coordinator will contact you at your E-Mail Address (<strong>{formData.email}</strong>) or WhatsApp number (<strong>{formData.whatsapp}</strong>) within 24 hours to coordinate setup details and convenient times.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Register Another Interest
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-emerald-700 text-xl font-extrabold tracking-widest uppercase">
                Show Interest
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900">Overseas Session Booking</h2>
              <p className="text-gray-500 text-sm">
                Provide your details below to share your time zone and health goals with us.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${formErrors.name ? "border-red-400" : "border-gray-200"
                      }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Country of Residence */}
                <div className="space-y-1.5">
                  <label htmlFor="country" className="text-sm font-semibold text-gray-700">
                    Country of Residence *
                  </label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. USA, UK, Canada"
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${formErrors.country ? "border-red-400" : "border-gray-200"
                      }`}
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.country}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Timings */}
                <div className="space-y-1">
                  <label htmlFor="timings" className="text-sm font-semibold text-gray-700">
                    Preferred Class Timings (IST) *
                  </label>
                  <input
                    id="timings"
                    type="text"
                    name="timings"
                    value={formData.timings}
                    onChange={handleInputChange}
                    placeholder="e.g. Evening 6:00 PM IST"
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${formErrors.timings ? "border-red-400" : "border-gray-200"
                      }`}
                  />
                  {formErrors.timings && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.timings}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-1">
                  <label htmlFor="whatsapp" className="text-sm font-semibold text-gray-700">
                    WhatsApp Number (with Country Code) *
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 555-0199"
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${formErrors.whatsapp ? "border-red-400" : "border-gray-200"
                      }`}
                  />
                  {formErrors.whatsapp && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    E-Mail Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${formErrors.email ? "border-red-400" : "border-gray-200"
                      }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Planned Joining Date */}
                <div className="space-y-1">
                  <label htmlFor="joiningDate" className="text-sm font-semibold text-gray-700">
                    Planned Joining Date *
                  </label>
                  <input
                    id="joiningDate"
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${formErrors.joiningDate ? "border-red-400" : "border-gray-200"
                      }`}
                  />
                  {formErrors.joiningDate && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.joiningDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Health Goal */}
              <div className="space-y-1">
                <label htmlFor="healthGoal" className="text-sm font-semibold text-gray-700">
                  Any Specific Health / Wellness Goal (Optional)
                </label>
                <textarea
                  id="healthGoal"
                  name="healthGoal"
                  rows="3"
                  value={formData.healthGoal}
                  onChange={handleInputChange}
                  placeholder="Share details of posturing needs, flexibility targets, or ailments (if any) - maximum 250 words"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>Registering Interest...</span>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer Tagline Section ─── */}
      <section className="px-6 py-6 text-center max-w-xs mx-auto">
        <div className="border-t border-gray-200 pt-6">
          <span className="great-vibes-regular text-2xl text-emerald-600 tracking-wide block">
            YogSaathi
          </span>
          <span className="great-vibes-regular text-2xl text-emerald-600 tracking-wide block">
            Together in Every Asana
          </span>
        </div>
      </section>
    </div>
  );
};

export default OverseasPrograms;